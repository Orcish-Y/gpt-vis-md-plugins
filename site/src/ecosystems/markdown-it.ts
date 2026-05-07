import markdownIt from 'markdown-it';
import { gptVisMarkdownItPlugin } from 'gpt-vis-markdown-it';
import type { EcosystemAdapter } from './types';

const md = markdownIt().use(gptVisMarkdownItPlugin, { wrapper: true });

export const markdownItAdapter: EcosystemAdapter = {
  id: 'markdown-it',
  label: 'markdown-it',
  description: 'markdown-it + gpt-vis plugin',
  process(markdown: string): string {
    return md.render(markdown);
  },
};
