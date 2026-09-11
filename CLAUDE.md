# Repository guide

This repository is a clean Next.js template. Keep its baseline small and add dependencies only when a product requirement needs them.

## Commands

```bash
pnpm dev
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Use pnpm and keep `pnpm-lock.yaml` aligned with `package.json`.

## Frontend conventions

- Prefer React Server Components. Add `'use client'` only at the smallest interactive boundary.
- Add shadcn/ui components with `pnpm dlx shadcn@latest add <component>` and keep generated source in `src/components/ui`.
- Reuse semantic tokens from `src/app/globals.css`; avoid a second runtime UI framework or a parallel token system.
- Keep pages responsive, keyboard accessible, and readable at 200% zoom.
- Use `next/image` for product images and `next/font` for fonts.
- Update README or `docs/template-setup.md` when setup, commands, or project structure changes.

Run every quality check before handing off a change. Report failures rather than suppressing them.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
