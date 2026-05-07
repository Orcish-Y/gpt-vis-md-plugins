import type { Element, ElementContent, Root } from 'hast';
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
  const { tagName = 'gpt-vis', keepOriginal = false } = options;

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

      const container: Element = {
        type: 'element',
        tagName,
        properties: {
          'data-gpt-vis': syntax,
        },
        children: [],
      };

      const replacement: ElementContent[] = keepOriginal
        ? [container, { ...node } as Element]
        : [container];

      parent.children.splice(index, 1, ...replacement);
    });
  };
};
