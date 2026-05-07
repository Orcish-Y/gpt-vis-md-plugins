# gpt-vis-markdown-it

> 将 `GPT-Vis` 代码块转换为 `<gpt-vis>` Web Component 的 markdown-it 插件。

[![npm](https://img.shields.io/npm/v/gpt-vis-markdown-it)](https://www.npmjs.com/package/gpt-vis-markdown-it)

## 安装

```bash
pnpm add gpt-vis-markdown-it @antv/gpt-vis markdown-it
```

## 使用

> **注意**：插件必须在语法高亮插件之前注册，否则高亮器可能改变代码块结构导致解析失败。

````ts
import MarkdownIt from 'markdown-it';
import { gptVisMarkdownItPlugin, registerGPTVisElement } from 'gpt-vis-markdown-it';

registerGPTVisElement();

const md = new MarkdownIt();
md.use(gptVisMarkdownItPlugin);

const html = md.render('# Hello\n\n```GPT-Vis\nvis line\ndata ...\n```');
````

## 配置项

| 参数           | 类型                                          | 默认值      | 描述                       |
| -------------- | --------------------------------------------- | ----------- | -------------------------- |
| `tagName`      | `string`                                      | `'gpt-vis'` | 自定义容器标签名           |
| `keepOriginal` | `boolean`                                     | `false`     | 保留原始代码块作为降级内容 |
| `width`        | `number`                                      | `undefined` | 默认图表宽度（px）         |
| `height`       | `number`                                      | `undefined` | 默认图表高度（px）         |
| `theme`        | `'default' \| 'light' \| 'dark' \| 'academy'` | `'default'` | 默认图表主题               |

```ts
md.use(gptVisMarkdownItPlugin, {
  tagName: 'vis-chart',
  keepOriginal: true,
  theme: 'dark',
  width: 800,
  height: 400,
});
```

## API

| 导出                                 | 描述                                |
| ------------------------------------ | ----------------------------------- |
| `gptVisMarkdownItPlugin`（默认导出） | markdown-it 插件函数                |
| `isVisSyntax(text)`                  | 检查字符串是否为有效的 GPT-Vis 语法 |
| `registerGPTVisElement(options?)`    | 注册 `<gpt-vis>` Web Component      |
| `GPTVisDefaultOptions`               | 插件配置项类型                      |

## License

[MIT](../../LICENSE)
