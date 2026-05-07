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
  const { tagName = 'gpt-vis', keepOriginal = false } = options;

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
        const visHtml = `<${tagName} data-gpt-vis="${escaped}"></${tagName}>`;

        if (keepOriginal) {
          const originalHtml = `<pre><code class="language-${escapeHtml(lang)}">${escapeHtml(text)}</code></pre>`;
          return visHtml + '\n' + originalHtml;
        }

        return visHtml;
      },
    },
  };
}
