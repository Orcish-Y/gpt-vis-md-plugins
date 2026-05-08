import { registerGPTVisElement } from '@gpt-vis-plugin/rehype';
import { defaultMarkdown } from './default-markdown';
import { ecosystemRegistry } from './ecosystems/registry';
import { rehypeAdapter } from './ecosystems/rehype';
import { markdownItAdapter } from './ecosystems/markdown-it';
import { markedAdapter } from './ecosystems/marked';
import type { EcosystemAdapter } from './ecosystems/types';

registerGPTVisElement();

ecosystemRegistry.register(rehypeAdapter);
ecosystemRegistry.register(markdownItAdapter);
ecosystemRegistry.register(markedAdapter);

let currentEcosystem: EcosystemAdapter = ecosystemRegistry.getDefault();

const editor = document.getElementById('editor') as HTMLTextAreaElement;
const preview = document.getElementById('preview') as HTMLElement;
const tabContainer = document.getElementById('ecosystem-tabs') as HTMLElement;

async function render(markdown: string) {
  try {
    const html = await currentEcosystem.process(markdown);
    preview.innerHTML = html;
  } catch (err) {
    console.error('Pipeline error:', err);
    preview.innerHTML = `<p style="color:red">Error: ${(err as Error).message}</p>`;
  }
}

function renderTabs() {
  const slots = ecosystemRegistry.getAll();
  for (const slot of slots) {
    const btn = document.createElement('button');
    btn.className = 'eco-tab';
    btn.textContent = slot.label;
    if (!slot.available) {
      btn.disabled = true;
      const badge = document.createElement('span');
      badge.className = 'coming-soon';
      badge.textContent = ' (soon)';
      btn.appendChild(badge);
    }
    if (slot.available && slot.adapter?.id === currentEcosystem.id) {
      btn.classList.add('active');
    }
    btn.addEventListener('click', () => {
      if (!slot.adapter) return;
      currentEcosystem = slot.adapter;
      updateActiveTab();
      render(editor.value);
    });
    tabContainer.appendChild(btn);
  }
}

function updateActiveTab() {
  const slots = ecosystemRegistry.getAll();
  tabContainer.querySelectorAll<HTMLElement>('.eco-tab').forEach((btn, i) => {
    const slot = slots[i];
    btn.classList.toggle('active', !!(slot.adapter && slot.adapter.id === currentEcosystem.id));
  });
}

let debounceTimer: ReturnType<typeof setTimeout>;
editor.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => render(editor.value), 300);
});

renderTabs();
editor.value = defaultMarkdown;
render(defaultMarkdown);
