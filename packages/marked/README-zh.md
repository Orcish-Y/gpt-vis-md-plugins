# @gpt-vis-plugin/marked

> 将 `GPT-Vis` 代码块转换为 `<gpt-vis>` Web Component 的 Marked 扩展。

[![npm](https://img.shields.io/npm/v/@gpt-vis-plugin/marked)](https://www.npmjs.com/package/@gpt-vis-plugin/marked)

## 安装

```bash
pnpm add @gpt-vis-plugin/marked @antv/gpt-vis marked
```

## 使用

> **注意**：扩展必须在语法高亮扩展之前注册，否则高亮器可能改变代码块结构导致解析失败。

````ts
import { Marked } from 'marked';
import { markedGPTVis, registerGPTVisElement } from '@gpt-vis-plugin/marked';

registerGPTVisElement();

const marked = new Marked();
marked.use(markedGPTVis());

const html = await marked.parse('# Hello\n\n```GPT-Vis\nvis line\ndata ...\n```');
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

| export                            | 描述                                           |
| --------------------------------- | ---------------------------------------------- |
| `markedGPTVis`（默认导出）        | Marked 扩展工厂函数（`() => MarkedExtension`） |
| `isVisSyntax(text)`               | 检查字符串是否为有效的 GPT-Vis 语法            |
| `registerGPTVisElement(options?)` | 注册 `<gpt-vis>` Web Component                 |
| `GPTVisDefaultOptions`            | 插件配置项类型                                 |

## License

[MIT](../../LICENSE)
