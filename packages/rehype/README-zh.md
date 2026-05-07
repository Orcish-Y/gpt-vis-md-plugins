# gpt-vis-rehype

> 将 `GPT-Vis` 代码块转换为 `<gpt-vis>` Web Component 的 rehype 插件。

[![npm](https://img.shields.io/npm/v/gpt-vis-rehype)](https://www.npmjs.com/package/gpt-vis-rehype)

## 安装

```bash
pnpm add gpt-vis-rehype @antv/gpt-vis
```

## 使用

> **注意**：插件必须在语法高亮插件（如 `rehype-highlight`）之前运行，否则高亮器可能改变代码块结构导致解析失败。

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

## 配置项

| 参数           | 类型                                          | 默认值      | 描述                       |
| -------------- | --------------------------------------------- | ----------- | -------------------------- |
| `tagName`      | `string`                                      | `'gpt-vis'` | 自定义容器标签名           |
| `keepOriginal` | `boolean`                                     | `false`     | 保留原始代码块作为降级内容 |
| `width`        | `number`                                      | `undefined` | 默认图表宽度（px）         |
| `height`       | `number`                                      | `undefined` | 默认图表高度（px）         |
| `theme`        | `'default' \| 'light' \| 'dark' \| 'academy'` | `'default'` | 默认图表主题               |
| `wrapper`      | `boolean`                                     | `false`     | 是否开启容器包裹           |

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

| 导出                              | 描述                                |
| --------------------------------- | ----------------------------------- |
| `rehypeGPTVis`（默认导出）        | Rehype 插件函数                     |
| `isVisSyntax(text)`               | 检查字符串是否为有效的 GPT-Vis 语法 |
| `registerGPTVisElement(options?)` | 注册 `<gpt-vis>` Web Component      |
| `GPTVisDefaultOptions`            | 插件配置项类型                      |

## License

[MIT](../../LICENSE)
