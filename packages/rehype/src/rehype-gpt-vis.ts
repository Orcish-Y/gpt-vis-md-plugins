import type { Element, ElementContent, Properties, Root } from 'hast';
import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';

export interface RehypeGPTVisOptions {
  /**
   * Custom tag name for the container element.
   * @default 'gpt-vis'
   */
  tagName?: string;

  /**
   * Whether to keep the original code block as a fallback.
   * @default false
   */
  keepOriginal?: boolean;

  /**
   * Whether to enable the wrapper container.
   * @default false
   */
  wrapper?: boolean;

  /**
   * Any other keys are forwarded as data-* attributes on the <gpt-vis> element.
   * CamelCase keys are converted to kebab-case (e.g. customParam → data-custom-param).
   */
  [key: string]: unknown;
}

function getTextContent(node: Element): string {
  const texts: string[] = [];
  for (const child of node.children) {
    if (child.type === 'text') {
      texts.push(child.value);
    }
  }
  return texts.join('');
}

export function isVisSyntax(text: string): boolean {
  return text.trimStart().startsWith('vis ');
}

export const rehypeGPTVis: Plugin<[RehypeGPTVisOptions?], Root> = (options = {}) => {
  const { tagName = 'gpt-vis', keepOriginal = false, wrapper, ...restAttrs } = options;

  const userAttrs: Record<string, string | number | boolean> = { ...restAttrs } as Record<
    string,
    string | number | boolean
  >;
  if (wrapper !== undefined && !('wrapper' in userAttrs)) {
    userAttrs.wrapper = wrapper;
  }

  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre' || index === undefined || !parent) {
        return;
      }

      const codeEl = node.children.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'code',
      );

      if (!codeEl) return;

      const className = codeEl.properties?.className;
      const classList = Array.isArray(className) ? className : [className];
      const isGPTVisBlock = classList.some((c) => String(c).toLowerCase() === 'language-gpt-vis');

      if (!isGPTVisBlock) return;

      const syntax = getTextContent(codeEl).trim();
      if (!isVisSyntax(syntax)) return;

      const properties: Properties = {
        'data-gpt-vis': syntax,
      };
      for (const [key, value] of Object.entries(userAttrs)) {
        const kebabKey = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
        properties[`data-${kebabKey}`] = String(value);
      }

      const container: Element = {
        type: 'element',
        tagName,
        properties,
        children: [],
      };

      const replacement: ElementContent[] = keepOriginal
        ? [container, { ...node } as Element]
        : [container];

      parent.children.splice(index, 1, ...replacement);
    });
  };
};
