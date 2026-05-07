import { Marked } from 'marked';
import { markedGPTVis } from 'gpt-vis-marked';
import type { EcosystemAdapter } from './types';

const marked = new Marked({ gfm: true });
marked.use(markedGPTVis({ wrapper: true }));

export const markedAdapter: EcosystemAdapter = {
  id: 'marked',
  label: 'Marked',
  description: 'marked + gpt-vis extension',
  process(markdown: string): string | Promise<string> {
    return marked.parse(markdown);
  },
};
