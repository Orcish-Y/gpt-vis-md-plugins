# gpt-vis-rehype

> A rehype plugin that transforms `GPT-Vis` code blocks into `<gpt-vis>` Web Components.

[![npm](https://img.shields.io/npm/v/gpt-vis-rehype)](https://www.npmjs.com/package/gpt-vis-rehype)

## Installation

```bash
pnpm add gpt-vis-rehype @antv/gpt-vis
```

## Usage

> **Note**: The plugin must run before syntax highlighters (e.g., `rehype-highlight`), otherwise the highlighter may alter code block structure and cause parsing failures.

````ts
import { rehypeGPTVis, registerGPTVisElement } from 'gpt-vis-rehype';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

registerGPTVisElement();

const html = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeGPTVis)
  .use(rehypeStringify)
  .process('# Hello\n\n```GPT-Vis\nvis line\ndata ...\n```');

console.log(String(html));
````

## Options

| Option         | Type                                          | Default     | Description                                      |
| -------------- | --------------------------------------------- | ----------- | ------------------------------------------------ |
| `tagName`      | `string`                                      | `'gpt-vis'` | Custom container tag name                        |
| `keepOriginal` | `boolean`                                     | `false`     | Keep the original code block as fallback content |
| `width`        | `number`                                      | `undefined` | Default chart width (px)                         |
| `height`       | `number`                                      | `undefined` | Default chart height (px)                        |
| `theme`        | `'default' \| 'light' \| 'dark' \| 'academy'` | `'default'` | Default chart theme                              |
| `wrapper`      | `boolean`                                     | `false`     | Enable the wrapper container                     |

```ts
.use(rehypeGPTVis, {
  tagName: 'vis-chart',
  keepOriginal: true,
  wrapper: true,
  theme: 'dark',
  width: 800,
  height: 400,
})
```

## API

| Export                            | Description                               |
| --------------------------------- | ----------------------------------------- |
| `rehypeGPTVis` (default)          | Rehype plugin function                    |
| `isVisSyntax(text)`               | Check if a string is valid GPT-Vis syntax |
| `registerGPTVisElement(options?)` | Register the `<gpt-vis>` Web Component    |
| `GPTVisDefaultOptions`            | Plugin options type                       |

## License

[MIT](../../LICENSE)
