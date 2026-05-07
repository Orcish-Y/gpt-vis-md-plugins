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
}

export function isVisSyntax(text: string): boolean {
  return text.trimStart().startsWith('vis ');
}

export function gptVisMarkdownItPlugin(
  md: MarkdownIt,
  options: MarkdownItGPTVisOptions = {},
): void {
  const { tagName = 'gpt-vis', keepOriginal = false, wrapper } = options;

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

    const attr = md.utils.escapeHtml(syntax);
    const wrapperAttr = wrapper ? ' data-wrapper="true"' : '';
    const visHtml = `<${tagName} data-gpt-vis="${attr}"${wrapperAttr}></${tagName}>`;

    if (keepOriginal) {
      const originalHtml = defaultFence(tokens, idx, mdOptions, env, self);
      return visHtml + '\n' + originalHtml;
    }

    return visHtml;
  };
}
