import type { MarkedExtension, Tokens } from 'marked';

export interface MarkedGPTVisOptions {
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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function isVisSyntax(text: string): boolean {
  return text.trimStart().startsWith('vis ');
}

export function markedGPTVis(options: MarkedGPTVisOptions = {}): MarkedExtension {
  const { tagName = 'gpt-vis', keepOriginal = false, wrapper, ...restAttrs } = options;

  const userAttrs: Record<string, string | number | boolean> = { ...restAttrs } as Record<
    string,
    string | number | boolean
  >;
  if (wrapper !== undefined && !('wrapper' in userAttrs)) {
    userAttrs.wrapper = wrapper;
  }

  const visAttrs = Object.entries(userAttrs)
    .map(([k, v]) => {
      const attrName = 'data-' + k.replace(/[A-Z]/g, (l) => '-' + l.toLowerCase());
      return ` ${attrName}="${escapeHtml(String(v))}"`;
    })
    .join('');

  return {
    renderer: {
      code({ text, lang }: Tokens.Code): string | false {
        if (!lang || lang.toLowerCase() !== 'gpt-vis') {
          return false;
        }

        const syntax = text.trim();
        if (!isVisSyntax(syntax)) {
          return false;
        }

        const escaped = escapeHtml(syntax);
        const visHtml = `<${tagName} data-gpt-vis="${escaped}"${visAttrs}></${tagName}>`;

        if (keepOriginal) {
          const originalHtml = `<pre><code class="language-${escapeHtml(lang)}">${escapeHtml(text)}</code></pre>`;
          return visHtml + '\n' + originalHtml;
        }

        return visHtml;
      },
    },
  };
}
