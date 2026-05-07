# gpt-vis-marked

> A Marked extension that transforms `GPT-Vis` code blocks into `<gpt-vis>` Web Components.

[![npm](https://img.shields.io/npm/v/gpt-vis-marked)](https://www.npmjs.com/package/gpt-vis-marked)

## Installation

```bash
pnpm add gpt-vis-marked @antv/gpt-vis marked
```

## Usage

> **Note**: The extension must be registered before any syntax highlighting extension, otherwise the highlighter may alter code block structure and cause parsing failures.

````ts
import { Marked } from 'marked';
import { markedGPTVis, registerGPTVisElement } from 'gpt-vis-marked';

registerGPTVisElement();

const marked = new Marked();
marked.use(markedGPTVis());

const html = await marked.parse('# Hello\n\n```GPT-Vis\nvis line\ndata ...\n```');
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
marked.use(
  markedGPTVis({
    tagName: 'vis-chart',
    keepOriginal: true,
    wrapper: true,
    theme: 'dark',
    width: 800,
    height: 400,
  }),
);
```

## API

| Export                            | Description                                        |
| --------------------------------- | -------------------------------------------------- |
| `markedGPTVis` (default)          | Marked extension factory (`() => MarkedExtension`) |
| `isVisSyntax(text)`               | Check if a string is valid GPT-Vis syntax          |
| `registerGPTVisElement(options?)` | Register the `<gpt-vis>` Web Component             |
| `GPTVisDefaultOptions`            | Plugin options type                                |

## License

[MIT](../../LICENSE)
