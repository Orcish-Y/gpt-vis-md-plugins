// @ts-ignore
import { GPTVis, isVisSyntax } from '@antv/gpt-vis';

export interface GPTVisDefaultOptions {
  width?: number;
  height?: number;
  theme?: 'default' | 'light' | 'dark' | 'academy';
}

let defaultOptions: GPTVisDefaultOptions = {};

class GPTVisElement extends HTMLElement {
  private _instance: GPTVis | null = null;

  connectedCallback() {
    const syntax = this.dataset.gptVis;
    if (!syntax) return;

    const width = this.dataset.width ? Number(this.dataset.width) : defaultOptions.width;
    const height = this.dataset.height ? Number(this.dataset.height) : defaultOptions.height;
    const theme = (this.dataset.theme || defaultOptions.theme) as
      | 'default'
      | 'light'
      | 'dark'
      | 'academy'
      | undefined;

    this._instance = new GPTVis({
      container: this,
      width,
      height,
      theme,
    });

    if (isVisSyntax(syntax)) {
      this._instance.render(syntax);
    }
  }

  disconnectedCallback() {
    this._instance?.destroy();
    this._instance = null;
  }

  static get observedAttributes() {
    return ['data-gpt-vis', 'data-width', 'data-height', 'data-theme'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    if (name === 'data-gpt-vis' && this._instance && isVisSyntax(newValue)) {
      this._instance.render(newValue);
    }
  }
}

export function registerGPTVisElement(options: GPTVisDefaultOptions = {}) {
  defaultOptions = options;
  if (!customElements.get('gpt-vis')) {
    customElements.define('gpt-vis', GPTVisElement);
  }
}
