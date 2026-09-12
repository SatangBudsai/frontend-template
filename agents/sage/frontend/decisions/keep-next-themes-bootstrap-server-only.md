---
id: keep-next-themes-bootstrap-server-only
type: team_decision
title: Keep the next-themes bootstrap script server-only
domain: frontend
tags: [next-themes, react, hydration, theme, pnpm-patch]
status: proposed
enforcement: warn
applies_to: [package.json, pnpm-lock.yaml, 'patches/**', src/components/theme-provider.tsx]
source: ai
supersedes: ''
related: [keep-provider-integrations-optional]
timestamp: 2026-09-12T00:00:00+07:00
---

With React 19 and Next.js 16, `next-themes@0.4.6` can render its native bootstrap `<script>` again during a client remount and trigger React's client-script warning. Keep the bootstrap script in the server-rendered document so the saved or system theme is applied before paint, but return `null` when the library's script component renders in the browser.

Pin the dependency and maintain this behavior through the tracked pnpm patch until an upstream release includes the same guard. Do not replace the root provider with a client-only dynamic import because that removes the no-flash initialization. When upgrading `next-themes`, verify initial theme rendering, theme persistence after reload, and the absence of the warning before removing the patch and `patchedDependencies` entry.
