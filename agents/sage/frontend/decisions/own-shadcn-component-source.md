---
id: own-shadcn-component-source
type: team_decision
title: Own shadcn/ui component source
domain: frontend
tags: [shadcn, components, dependencies]
status: proposed
enforcement: advise
applies_to: [components.json, "src/components/ui/**", package.json]
source: ai
supersedes: ""
related: []
timestamp: 2026-09-10T00:00:00+07:00
---

Treat generated shadcn/ui files as application source, not opaque vendor components. Add primitives through the CLI, review the generated dependency and source diff, then customize the local component only when the product needs it.

Prefer one shared component path and one semantic token system. Avoid installing a second comprehensive UI framework for a component already owned under `src/components/ui`.
