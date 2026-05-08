# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Layout

```
gpt-vis-plugins/
├── shared/gpt-vis-render/   ← Web Component + registerGPTVisElement (shared by all 3 packages)
├── packages/
│   ├── markdown-it/          → @gpt-vis-plugin/markdown-it
│   ├── marked/               → @gpt-vis-plugin/marked
│   └── rehype/               → @gpt-vis-plugin/rehype
└── site/                     ← Vite playground with 3 ecosystem tabs
```

## Architecture

All three packages follow the same pattern: detect `GPT-Vis` fenced code blocks in Markdown, validate the content starts with `vis `, then output a `<gpt-vis data-gpt-vis="...">` custom element. The browser-side `GPTVisElement` Web Component (in `shared/gpt-vis-render/index.ts`) instantiates `@antv/gpt-vis`'s `GPTVis` class on mount and renders the chart.

The shared module is **not** a workspace package — each package imports it via a relative path (`../../../shared/gpt-vis-render`). Each package's `vite.config.ts` includes `../../shared` in `vite-plugin-dts` so types are rolled up into the dist.

Each package's `index.ts` barrel re-exports: the plugin function (default), `isVisSyntax`, `registerGPTVisElement`, and types.

The `wrapper` option adds `data-wrapper="true"` to the output element; `keepOriginal` preserves the original code block as fallback HTML after the `<gpt-vis>` element.

## Commands

```bash
pnpm dev              # Watch-build all packages in parallel
pnpm build            # Build all packages (packages/* only, not site)
pnpm typecheck        # Type-check all packages in parallel

# Per-package (from repo root or package dir):
pnpm --filter @gpt-vis-plugin/markdown-it build
pnpm --filter @gpt-vis-plugin/marked typecheck

# Site:
pnpm --filter site dev       # Start playground at localhost:5173
pnpm --filter site build     # Build site for production
```

## Build System

- **Package manager**: pnpm (>=8), workspace declared in `pnpm-workspace.yaml`
- **Bundler**: Vite (library mode, ES format only). Config in each `packages/*/vite.config.ts`
- **Types**: `vite-plugin-dts` generates rolled-up `.d.ts` from `src` + `../../shared`
- **TypeScript**: strict mode, ESNext target, bundler module resolution. Base config in `tsconfig.base.json`, each package extends it

## Key Conventions

- Node >= 20, ESM only (`"type": "module"`)
- All peer dependencies (markdown-it, marked, unified, @antv/gpt-vis) are externalized in Vite builds
- The rehype package has a real dependency on `unist-util-visit` (used in the plugin for AST traversal)
- `isVisSyntax(text)` returns true if the trimmed text starts with `vis ` — this is duplicated identically across all three packages (not shared)
- Pre-commit: prettier formatting + typecheck via lint-staged. Commit messages follow conventional commits (commitlint)
