import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/gpt-vis-plugins/',
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        doc: resolve(__dirname, 'doc.html'),
      },
    },
  },
});
