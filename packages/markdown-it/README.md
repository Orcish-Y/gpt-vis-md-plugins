# gpt-vis-markdown-it

> A markdown-it plugin that transforms `GPT-Vis` code blocks into `<gpt-vis>` Web Components.

[![npm](https://img.shields.io/npm/v/gpt-vis-markdown-it)](https://www.npmjs.com/package/gpt-vis-markdown-it)

## Installation

```bash
pnpm add gpt-vis-markdown-it @antv/gpt-vis markdown-it
```

## Usage

> **Note**: The plugin must run before any syntax highlighting plugin, otherwise the highlighter may alter code block structure and cause parsing failures.

````ts
import MarkdownIt from 'markdown-it';
import { gptVisMarkdownItPlugin, registerGPTVisElement } from 'gpt-vis-markdown-it';

registerGPTVisElement();

const md = new MarkdownIt();
md.use(gptVisMarkdownItPlugin);

const html = md.render('# Hello\n\n```GPT-Vis\nvis line\ndata ...\n```');
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
md.use(gptVisMarkdownItPlugin, {
  tagName: 'vis-chart',
  keepOriginal: true,
  theme: 'dark',
  width: 800,
  height: 400,
  wrapper: true,
});
```

## API

| Export                             | Description                               |
| ---------------------------------- | ----------------------------------------- |
| `gptVisMarkdownItPlugin` (default) | markdown-it plugin function               |
| `isVisSyntax(text)`                | Check if a string is valid GPT-Vis syntax |
| `registerGPTVisElement(options?)`  | Register the `<gpt-vis>` Web Component    |
| `GPTVisDefaultOptions`             | Plugin options type                       |

## License

[MIT](../../LICENSE)
