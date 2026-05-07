# GPT-Vis Markdown Plugins

中文 | [English](./README.md)

> 为三大主流 Markdown 渲染生态提供的 GPT-Vis 可视化语法插件，让你在 Markdown 中直接编写图表代码并实时渲染。

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![npm](https://img.shields.io/npm/v/gpt-vis-rehype)](https://www.npmjs.com/package/gpt-vis-rehype)
[![Site](https://img.shields.io/badge/demo-gpt--vis.antv.vision-brightgreen)](https://gpt-vis.antv.vision)

## 简介

在 Markdown 中嵌入 `GPT-Vis` 代码块，即可渲染为可视化图表。本项目为 **markdown-it**、**Marked**、**Unified (rehype)** 三种生态提供统一插件，输出标准的 `<gpt-vis>` Web Component，开箱即用。

```markdown
### GPT-Vis

折线图示例

​`​`​`GPT-Vis
vis line
data "月份" "销售额" "利润"
一月 120 40
二月 200 60
三月 150 50
四月 80 30
五月 70 28
六月 110 45
color #4A90D9 #6DBF66
​`​`​`
```

## 包列表

| 包名                                             | 生态             | 说明                                          |
| ------------------------------------------------ | ---------------- | --------------------------------------------- |
| [`gpt-vis-rehype`](./packages/rehype/)           | Unified / rehype | 适用于 unified 生态（react-markdown、MDX 等） |
| [`gpt-vis-markdown-it`](./packages/markdown-it/) | markdown-it      | 适用于 markdown-it（Vitepress、VuePress 等）  |
| [`gpt-vis-marked`](./packages/marked/)           | Marked           | 适用于 Marked（Hexo、GitBook 等）             |

## 安装

### 前置依赖

- Node.js >= 20
- `@antv/gpt-vis` >= 1.0.0

### 安装插件

根据你使用的 Markdown 渲染器选择对应包：

```bash
# rehype (Unified 生态)
pnpm add gpt-vis-rehype @antv/gpt-vis

# markdown-it
pnpm add gpt-vis-markdown-it @antv/gpt-vis markdown-it

# Marked
pnpm add gpt-vis-marked @antv/gpt-vis marked
```

## 使用

> **注意**：所有插件都需要在浏览器环境中注册 `<gpt-vis>` 自定义元素。请确保在使用前调用 `registerGPTVisElement()`。
>
> **注意**：GPT-Vis 插件需要在代码高亮插件之前执行。例如在 Unified 中，`rehypeGPTVis` 应排在 `rehype-highlight` 之前，否则高亮插件可能改变代码块结构导致解析失败。

### Unified / rehype

```ts
import { rehypeGPTVis, registerGPTVisElement } from 'gpt-vis-rehype';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

// 注册 Web Component（只需调用一次）
registerGPTVisElement();

const html = await unified()
  .use(remarkParse) // Markdown → mdast
  .use(remarkRehype) // mdast → hast
  .use(rehypeGPTVis) // 转换 GPT-Vis 代码块为 <gpt-vis> 元素
  .use(rehypeStringify) // hast → HTML
  .process('# Hello\n\n\`\`\`GPT-Vis\nvis line\ndata ...\n\`\`\`');

console.log(String(html));
```

### markdown-it

```ts
import MarkdownIt from 'markdown-it';
import { gptVisMarkdownItPlugin, registerGPTVisElement } from 'gpt-vis-markdown-it';

registerGPTVisElement();

const md = new MarkdownIt();
md.use(gptVisMarkdownItPlugin);

const html = md.render('# Hello\n\n\`\`\`GPT-Vis\nvis line\ndata ...\n\`\`\`');
```

### Marked

```ts
import { Marked } from 'marked';
import { markedGPTVis, registerGPTVisElement } from 'gpt-vis-marked';

registerGPTVisElement();

const marked = new Marked();
marked.use(markedGPTVis());

const html = await marked.parse('# Hello\n\n\`\`\`GPT-Vis\nvis line\ndata ...\n\`\`\`');
```

## 配置选项

每个插件都支持以下选项：

| 选项           | 类型                                          | 默认值      | 说明                           |
| -------------- | --------------------------------------------- | ----------- | ------------------------------ |
| `tagName`      | `string`                                      | `'gpt-vis'` | 自定义容器标签名               |
| `keepOriginal` | `boolean`                                     | `false`     | 是否保留原始代码块作为降级内容 |
| `width`        | `number`                                      | `undefined` | 图表默认宽度（px）             |
| `height`       | `number`                                      | `undefined` | 图表默认高度（px）             |
| `theme`        | `'default' \| 'light' \| 'dark' \| 'academy'` | `'default'` | 图表默认主题                   |
| `wrapper`      | `boolean`                                     | `false`     | 是否开启容器包裹               |

使用示例：

```ts
// 自定义标签名和降级内容
md.use(gptVisMarkdownItPlugin, {
  tagName: 'vis-chart',
  keepOriginal: true,
  wrapper: true,
  theme: 'dark',
  width: 800,
  height: 400,
});
```

渲染出的 HTML 元素也支持通过 `data-*` 属性单独覆盖默认配置：

```html
<gpt-vis
  data-gpt-vis="vis line&#10;data ..."
  data-width="600"
  data-height="300"
  data-theme="light"
></gpt-vis>
```

## API

每个包均导出以下公共 API：

| 导出                              | 说明                                |
| --------------------------------- | ----------------------------------- |
| 默认导出                          | 插件/扩展主函数                     |
| `isVisSyntax(text)`               | 判断字符串是否为有效的 GPT-Vis 语法 |
| `registerGPTVisElement(options?)` | 注册 `<gpt-vis>` Web Component      |
| `GPTVisDefaultOptions`            | 默认选项接口类型                    |

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/antvis/gpt-vis-md-plugins.git
cd gpt-vis-md-plugins

# 安装依赖
pnpm install

# 开发模式（watch 构建所有包）
pnpm dev

# 构建所有包
pnpm build

# 类型检查
pnpm typecheck

# 启动 Demo 站点
cd site && pnpm dev
```

Demo 站点提供一个在线 Playground，可在左侧编辑 Markdown，右侧实时预览渲染效果，并支持在三种生态间切换对比。

## 工作原理

```
Markdown (GPT-Vis 代码块)
       │
       ▼
  生态插件处理器
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
  可视化图表
```

1. **解析阶段**：插件拦截 Markdown 中使用 `GPT-Vis` 语言标记的代码块
2. **转换阶段**：将代码块内容提取为 `data-gpt-vis` 属性，生成 `<gpt-vis>` 自定义元素
3. **渲染阶段**：浏览器中 `<gpt-vis>` 元素挂载后，由 `@antv/gpt-vis` 接管渲染为图表

## 许可证

[MIT](./LICENSE)
