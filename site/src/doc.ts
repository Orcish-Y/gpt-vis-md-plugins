const content = document.getElementById('content')!;

function h(
  tag: string,
  attrs: Record<string, string> = {},
  ...children: (string | Node)[]
): HTMLElement {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.append(...children);
  return el;
}

function code(s: string): string {
  return `<code>${s}</code>`;
}

function pre(html: string): string {
  // minimal html-escaping for code inside pre
  const escaped = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<pre><code>${escaped}</code></pre>`;
}

function tag(name: string, required: boolean): string {
  const cls = required ? 'tag tag-required' : 'tag tag-optional';
  return `<span class="${cls}">${required ? 'required' : 'optional'}</span>`;
}

function render() {
  content.innerHTML = `
<h1>Documentation</h1>
<p>
  GPT-Vis Markdown Plugins transform <code>\`\`\`gpt-vis</code> fenced code blocks
  in Markdown into <code>&lt;gpt-vis&gt;</code> Web Components. This page covers
  setup and API for each supported ecosystem.
</p>

<h2 id="installation">Installation</h2>
<p>Install the package for your Markdown ecosystem, along with the peer dependency <code>@antv/gpt-vis</code>:</p>
${pre(`# Unified / rehype
npm install @gpt-vis-plugin/rehype @antv/gpt-vis

# markdown-it
npm install @gpt-vis-plugin/markdown-it @antv/gpt-vis markdown-it

# marked
npm install @gpt-vis-plugin/marked @antv/gpt-vis marked`)}

<h2 id="quick-start">Quick Start</h2>
<p>Regardless of which ecosystem you use, you must register the Web Component in the browser before rendering:</p>
${pre(`import { registerGPTVisElement } from '@gpt-vis-plugin/rehype';
// or from '@gpt-vis-plugin/markdown-it' / '@gpt-vis-plugin/marked'

registerGPTVisElement();

// Optional: pass global defaults
registerGPTVisElement({ width: 800, height: 600, theme: 'light' });`)}

<h2 id="ecosystem-unified">Unified / rehype</h2>
<p>
  The <code>@gpt-vis-plugin/rehype</code> package provides a
  <a href="https://github.com/rehypejs/rehype" target="_blank">rehype</a> plugin
  that transforms the hast AST. Use it in any unified pipeline.
</p>

<h3>Basic Usage</h3>
${pre(`import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeGPTVis from '@gpt-vis-plugin/rehype';

const html = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeGPTVis)          // place before syntax highlighters
  .use(rehypeStringify)
  .process(markdown);

document.getElementById('preview').innerHTML = String(html);`)}

<h3>Options</h3>
${pre(`import rehypeGPTVis from '@gpt-vis-plugin/rehype';

unified()
  .use(rehypeGPTVis, {
    tagName: 'gpt-vis',       // custom element tag name
    keepOriginal: false,      // keep the original <pre> as fallback
  })`)}

<h2 id="ecosystem-markdown-it">markdown-it</h2>
<p>
  The <code>@gpt-vis-plugin/markdown-it</code> package provides a
  <a href="https://github.com/markdown-it/markdown-it" target="_blank">markdown-it</a>
  plugin that overrides the fence renderer.
</p>

<h3>Basic Usage</h3>
${pre(`import MarkdownIt from 'markdown-it';
import gptVisMarkdownItPlugin from '@gpt-vis-plugin/markdown-it';

const md = new MarkdownIt();
md.use(gptVisMarkdownItPlugin); // register before syntax highlighters

const html = md.render(markdown);
document.getElementById('preview').innerHTML = html;`)}

<h3>Options</h3>
${pre(`md.use(gptVisMarkdownItPlugin, {
  tagName: 'gpt-vis',         // custom element tag name
  keepOriginal: false,        // append original <pre> as fallback
  wrapper: {                  // add class/style to the output element
    className: 'my-chart',
    style: 'margin: 20px 0',
  },
});`)}

<h2 id="ecosystem-marked">marked</h2>
<p>
  The <code>@gpt-vis-plugin/marked</code> package provides a
  <a href="https://github.com/markedjs/marked" target="_blank">marked</a>
  extension.
</p>

<h3>Basic Usage</h3>
${pre(`import { marked } from 'marked';
import markedGPTVis from '@gpt-vis-plugin/marked';

marked.use(markedGPTVis()); // register before syntax highlighters

const html = await marked.parse(markdown);
document.getElementById('preview').innerHTML = html;`)}

<h3>Options</h3>
${pre(`marked.use(markedGPTVis({
  tagName: 'gpt-vis',         // custom element tag name
  keepOriginal: false,        // keep the original code block as fallback
  wrapper: {                  // add class/style to the output element
    className: 'my-chart',
    style: 'margin: 20px 0',
  },
}));`)}

<h2>API Reference</h2>

<h3 id="api-register">registerGPTVisElement(options?)</h3>
<p>
  Registers the <code>&lt;gpt-vis&gt;</code> custom element.
  Must be called once in the browser before any rendering.
  Exported by all three packages.
</p>

<table>
  <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
  <tr>
    <td>options</td>
    <td><code>GPTVisDefaultOptions</code></td>
    <td>Global default width, height, and theme for all chart instances ${tag('optional', false)}</td>
  </tr>
</table>

<h3 id="api-isvis">isVisSyntax(text)</h3>
<p>
  Validates whether a string is a GPT-Vis visualization syntax.
  Returns <code>true</code> if the trimmed text starts with <code>"vis "</code>.
  Exported by all three packages.
</p>

<table>
  <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
  <tr><td>text</td><td><code>string</code></td><td>The raw content to validate ${tag('required', true)}</td></tr>
</table>

<h3 id="api-defaults">GPTVisDefaultOptions</h3>
<p>Options passed to <code>registerGPTVisElement()</code>. Exported by all three packages.</p>

<table>
  <tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr>
  <tr><td>width</td><td><code>number</code></td><td>—</td><td>Chart width in pixels ${tag('optional', false)}</td></tr>
  <tr><td>height</td><td><code>number</code></td><td>—</td><td>Chart height in pixels ${tag('optional', false)}</td></tr>
  <tr><td>theme</td><td><code>'default' | 'light' | 'dark' | 'academy'</code></td><td>—</td><td>Visual theme ${tag('optional', false)}</td></tr>
</table>

<h3 id="api-rehype">rehypeGPTVis(options?)</h3>
<p>
  The unified rehype plugin (default export of <code>@gpt-vis-plugin/rehype</code>).
  Walks the hast tree and replaces <code>&lt;pre&gt;&lt;code class="language-gpt-vis"&gt;</code>
  nodes with <code>&lt;gpt-vis&gt;</code> elements.
</p>

<h4>RehypeGPTVisOptions</h4>
<table>
  <tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr>
  <tr><td>tagName</td><td><code>string</code></td><td><code>'gpt-vis'</code></td><td>Custom element tag name ${tag('optional', false)}</td></tr>
  <tr><td>keepOriginal</td><td><code>boolean</code></td><td><code>false</code></td><td>Preserve original <code>&lt;pre&gt;</code> as fallback for non-vis syntax ${tag('optional', false)}</td></tr>
</table>

<h3 id="api-markdown-it">gptVisMarkdownItPlugin(md, options?)</h3>
<p>
  The markdown-it plugin (default export of <code>@gpt-vis-plugin/markdown-it</code>).
  Overrides <code>md.renderer.rules.fence</code> to intercept <code>gpt-vis</code> code blocks.
</p>

<h4>MarkdownItGPTVisOptions</h4>
<table>
  <tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr>
  <tr><td>tagName</td><td><code>string</code></td><td><code>'gpt-vis'</code></td><td>Custom element tag name ${tag('optional', false)}</td></tr>
  <tr><td>keepOriginal</td><td><code>boolean</code></td><td><code>false</code></td><td>Append original code block HTML as fallback ${tag('optional', false)}</td></tr>
  <tr><td>wrapper</td><td><code>GPTVisWrapper</code></td><td>—</td><td>Optional <code>className</code> and <code>style</code> applied to the output element ${tag('optional', false)}</td></tr>
</table>

<h3 id="api-marked">markedGPTVis(options?)</h3>
<p>
  Factory function (default export of <code>@gpt-vis-plugin/marked</code>).
  Returns a <code>MarkedExtension</code> object. Use with <code>marked.use()</code>.
</p>

<h4>MarkedGPTVisOptions</h4>
<table>
  <tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr>
  <tr><td>tagName</td><td><code>string</code></td><td><code>'gpt-vis'</code></td><td>Custom element tag name ${tag('optional', false)}</td></tr>
  <tr><td>keepOriginal</td><td><code>boolean</code></td><td><code>false</code></td><td>Keep the original code block as fallback ${tag('optional', false)}</td></tr>
  <tr><td>wrapper</td><td><code>GPTVisWrapper</code></td><td>—</td><td>Optional <code>className</code> and <code>style</code> applied to the output element ${tag('optional', false)}</td></tr>
</table>
  `;
}

// Highlight current section in sidebar on scroll
function onScroll() {
  const headings = content.querySelectorAll('h2, h3');
  const links = document.querySelectorAll<HTMLAnchorElement>('#sidebar a');
  let current = '';

  headings.forEach((h) => {
    const rect = h.getBoundingClientRect();
    if (rect.top <= 80) {
      current = h.id;
    }
  });

  links.forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

render();
window.addEventListener('scroll', onScroll, { passive: true });
