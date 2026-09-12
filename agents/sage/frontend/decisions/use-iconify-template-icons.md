---
id: use-iconify-template-icons
type: team_decision
title: Use Iconify for template icons
domain: frontend
tags: [template, icons, iconify, dependencies]
status: proposed
enforcement: warn
applies_to: [package.json, components.json, 'src/**/*.tsx', 'src/config/icons.ts']
source: human
supersedes: ''
related: [own-shadcn-component-source]
timestamp: 2026-09-12T00:00:00+07:00
---

Use Iconify through the project-owned `src/components/ui/icon.tsx` boundary and keep recurring Lucide collection IDs (`lucide:*`) in `src/config/icons.ts`. Do not include `lucide-react` in the template baseline.

Generate and track a local subset of icon data from `appIcons`; deployed UI must not depend on Iconify API availability for first render.

The shadcn CLI does not offer Iconify as a generator target. In this repository, add components with `pnpm ui:add <component...>` so generated Lucide imports are converted to the shared Iconify boundary, included in the offline bundle, and verified before committing.
