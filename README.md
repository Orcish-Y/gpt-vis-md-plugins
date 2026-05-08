# GPT-Vis Markdown Plugins

> GPT-Vis visualization syntax plugins for three major Markdown rendering ecosystems. Write chart code directly in Markdown and render it in real time.

English | [中文](./README-zh.md)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![npm](https://img.shields.io/npm/v/@gpt-vis-plugin/rehype)](https://www.npmjs.com/package/@gpt-vis-plugin/rehype)
[![Site](https://img.shields.io/badge/demo-gpt--vis.antv.vision-brightgreen)](https://gpt-vis.antv.vision)

## Introduction

Embed `GPT-Vis` code blocks in Markdown to render them as visualizations. This project provides unified plugins for **markdown-it**, **Marked**, and **Unified (rehype)**, outputting standard `<gpt-vis>` Web Components that work out of the box.

```markdown
### GPT-Vis

Line chart example

​`​`​`GPT-Vis
vis line
data "Month" "Sales" "Profit"
Jan 120 40
Feb 200 60
Mar 150 50
Apr 80 30
May 70 28
Jun 110 45
color #4A90D9 #6DBF66
​`​`​`
```

## Packages

| Package                                                  | Ecosystem        | Description                                       |
| -------------------------------------------------------- | ---------------- | ------------------------------------------------- |
| [`@gpt-vis-plugin/rehype`](./packages/rehype/)           | Unified / rehype | For unified ecosystem (react-markdown, MDX, etc.) |
| [`@gpt-vis-plugin/markdown-it`](./packages/markdown-it/) | markdown-it      | For markdown-it (Vitepress, VuePress, etc.)       |
| [`@gpt-vis-plugin/marked`](./packages/marked/)           | Marked           | For Marked (Hexo, GitBook, etc.)                  |

## Installation

### Prerequisites

- Node.js >= 20
- `@antv/gpt-vis` >= 1.0.0

### Install Plugins

Choose the package that matches your Markdown renderer:

```bash
# rehype (Unified ecosystem)
pnpm add @gpt-vis-plugin/rehype @antv/gpt-vis

# markdown-it
pnpm add @gpt-vis-plugin/markdown-it @antv/gpt-vis markdown-it

# Marked
pnpm add @gpt-vis-plugin/marked @antv/gpt-vis marked
```

## Usage

> **Note**: All plugins require the `<gpt-vis>` custom element to be registered in a browser environment. Make sure to call `registerGPTVisElement()` before use.
>
> **Note**: The GPT-Vis plugin must run before any syntax highlighting plugin. For example in Unified, `rehypeGPTVis` should come before `rehype-highlight`, otherwise the highlighter may alter the code block structure and cause parsing failures.

### Unified / rehype

```ts
import { rehypeGPTVis, registerGPTVisElement } from '@gpt-vis-plugin/rehype';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

// Register the Web Component (call once)
registerGPTVisElement();

const html = await unified()
  .use(remarkParse) // Markdown → mdast
  .use(remarkRehype) // mdast → hast
  .use(rehypeGPTVis) // Transform GPT-Vis code blocks into <gpt-vis> elements
  .use(rehypeStringify) // hast → HTML
  .process('# Hello\n\n\`\`\`GPT-Vis\nvis line\ndata ...\n\`\`\`');

console.log(String(html));
```

### markdown-it

```ts
import MarkdownIt from 'markdown-it';
import { gptVisMarkdownItPlugin, registerGPTVisElement } from '@gpt-vis-plugin/markdown-it';

registerGPTVisElement();

const md = new MarkdownIt();
md.use(gptVisMarkdownItPlugin);

const html = md.render('# Hello\n\n\`\`\`GPT-Vis\nvis line\ndata ...\n\`\`\`');
```

### Marked

```ts
import { Marked } from 'marked';
import { markedGPTVis, registerGPTVisElement } from '@gpt-vis-plugin/marked';

registerGPTVisElement();

const marked = new Marked();
marked.use(markedGPTVis());

const html = await marked.parse('# Hello\n\n\`\`\`GPT-Vis\nvis line\ndata ...\n\`\`\`');
```

## Options

Each plugin supports the following options:

| Option         | Type                                          | Default     | Description                                      |
| -------------- | --------------------------------------------- | ----------- | ------------------------------------------------ |
| `tagName`      | `string`                                      | `'gpt-vis'` | Custom container tag name                        |
| `keepOriginal` | `boolean`                                     | `false`     | Keep the original code block as fallback content |
| `width`        | `number`                                      | `undefined` | Default chart width (px)                         |
| `height`       | `number`                                      | `undefined` | Default chart height (px)                        |
| `theme`        | `'default' \| 'light' \| 'dark' \| 'academy'` | `'default'` | Default chart theme                              |
| `wrapper`      | `boolean`                                     | `false`     | Enable the wrapper container                     |

Example:

```ts
// Custom tag name with fallback content
md.use(gptVisMarkdownItPlugin, {
  tagName: 'vis-chart',
  keepOriginal: true,
  wrapper: true,
  theme: 'dark',
  width: 800,
  height: 400,
});
```

Rendered HTML elements also support overriding defaults via `data-*` attributes:

```html
<gpt-vis
  data-gpt-vis="vis line&#10;data ..."
  data-width="600"
  data-height="300"
  data-theme="light"
></gpt-vis>
```

## API

Each package exports the following public API:

| Export                            | Description                               |
| --------------------------------- | ----------------------------------------- |
| Default export                    | Plugin/extension main function            |
| `isVisSyntax(text)`               | Check if a string is valid GPT-Vis syntax |
| `registerGPTVisElement(options?)` | Register the `<gpt-vis>` Web Component    |
| `GPTVisDefaultOptions`            | Default options interface type            |

## Development

```bash
# Clone the repository
git clone https://github.com/antvis/gpt-vis-plugins.git
cd gpt-vis-plugins

# Install dependencies
pnpm install

# Dev mode (watch build all packages)
pnpm dev

# Build all packages
pnpm build

# Type check
pnpm typecheck

# Start the Demo site
cd site && pnpm dev
```

The Demo site provides an online Playground where you can edit Markdown on the left and preview the rendered output in real time on the right, with the ability to switch between the three ecosystems for comparison.

## How It Works

```
Markdown (GPT-Vis code block)
       │
       ▼
  Ecosystem plugin processor
  (markdown-it / Marked / rehype)
       │
       ▼
  <gpt-vis data-gpt-vis="..."></gpt-vis>
       │
       ▼
  GPTVisElement (Web Component)
  connectedCallback → new GPTVis() → render()
       │
       ▼
  Visualized chart
```

1. **Parsing stage**: The plugin intercepts Markdown code blocks tagged with the `GPT-Vis` language identifier
2. **Transformation stage**: Extracts the code block content into the `data-gpt-vis` attribute and generates a `<gpt-vis>` custom element
3. **Rendering stage**: Once the `<gpt-vis>` element is mounted in the browser, `@antv/gpt-vis` takes over and renders the chart

## License

[MIT](./LICENSE)
