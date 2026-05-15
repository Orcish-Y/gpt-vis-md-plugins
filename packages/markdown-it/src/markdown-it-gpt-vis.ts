import type MarkdownIt from 'markdown-it';

export interface MarkdownItGPTVisOptions {
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

export function isVisSyntax(text: string): boolean {
  return text.trimStart().startsWith('vis ');
}

export function gptVisMarkdownItPlugin(
  md: MarkdownIt,
  options: MarkdownItGPTVisOptions = {},
): void {
  const { tagName = 'gpt-vis', keepOriginal = false, wrapper, ...restAttrs } = options;

  const userAttrs: Record<string, string | number | boolean> = { ...restAttrs } as Record<
    string,
    string | number | boolean
  >;
  if (wrapper !== undefined && !('wrapper' in userAttrs)) {
    userAttrs.wrapper = wrapper;
  }

  const defaultFence = md.renderer.rules.fence!;

  md.renderer.rules.fence = (tokens, idx, mdOptions, env, self) => {
    const token = tokens[idx];
    const lang = token.info.trim().split(/\s+/)[0];

    if (!lang || lang.toLowerCase() !== 'gpt-vis') {
      return defaultFence(tokens, idx, mdOptions, env, self);
    }

    const syntax = token.content.trim();
    if (!isVisSyntax(syntax)) {
      return defaultFence(tokens, idx, mdOptions, env, self);
    }

    const visAttrs = Object.entries(userAttrs)
      .map(([k, v]) => {
        const attrName = 'data-' + k.replace(/[A-Z]/g, (l) => '-' + l.toLowerCase());
        return ` ${attrName}="${md.utils.escapeHtml(String(v))}"`;
      })
      .join('');

    const attr = md.utils.escapeHtml(syntax);
    const visHtml = `<${tagName} data-gpt-vis="${attr}"${visAttrs}></${tagName}>`;

    if (keepOriginal) {
      const originalHtml = defaultFence(tokens, idx, mdOptions, env, self);
      return visHtml + '\n' + originalHtml;
    }

    return visHtml;
  };
}
