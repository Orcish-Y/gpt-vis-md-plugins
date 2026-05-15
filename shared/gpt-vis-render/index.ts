// @ts-ignore
import { GPTVis, isVisSyntax } from '@antv/gpt-vis';

function parseDatasetValue(value: string): string | number | boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}

class GPTVisElement extends HTMLElement {
  private _instance: GPTVis | null = null;

  connectedCallback() {
    const syntax = this.dataset.gptVis;
    if (!syntax) return;

    const attrs: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(this.dataset)) {
      if (key === 'gptVis' || value === undefined) continue;
      attrs[key] = parseDatasetValue(value);
    }

    this._instance = new GPTVis({ container: this, ...attrs });

    if (isVisSyntax(syntax)) {
      this._instance.render(syntax);
    }
  }

  disconnectedCallback() {
    this._instance?.destroy();
    this._instance = null;
  }

  static get observedAttributes() {
    return ['data-gpt-vis'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    if (name === 'data-gpt-vis' && this._instance && isVisSyntax(newValue)) {
      this._instance.render(newValue);
    }
  }
}

export function registerGPTVisElement() {
  if (!customElements.get('gpt-vis')) {
    customElements.define('gpt-vis', GPTVisElement);
  }
}

if (typeof customElements !== 'undefined') {
  registerGPTVisElement();
}
