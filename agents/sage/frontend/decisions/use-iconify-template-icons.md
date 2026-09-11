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

Use Iconify through the project-owned `src/components/ui/icon.tsx` boundary and keep recurring icon IDs in `src/config/icons.ts`. Do not include `lucide-react` in the template baseline.

The shadcn CLI does not offer Iconify as a generator target, so every generated component containing icons must be reviewed and converted to the shared Iconify boundary before committing.
