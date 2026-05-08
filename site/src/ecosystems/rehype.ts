import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { rehypeGPTVis } from '@gpt-vis-plugin/rehype';
import type { EcosystemAdapter } from './types';

const pipeline = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeGPTVis, { wrapper: true })
  .use(rehypeStringify);

export const rehypeAdapter: EcosystemAdapter = {
  id: 'rehype',
  label: 'Unified / Rehype',
  description: 'remark-parse → remark-rehype → rehype-gpt-vis → rehype-stringify',
  process(markdown: string): Promise<string> {
    return pipeline.process(markdown).then(String);
  },
};
