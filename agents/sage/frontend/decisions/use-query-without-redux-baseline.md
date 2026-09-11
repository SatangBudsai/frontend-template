---
id: use-query-without-redux-baseline
type: team_decision
title: Use TanStack Query without Redux in the baseline
domain: frontend
tags: [template, state-management, tanstack-query, redux]
status: proposed
enforcement: advise
applies_to: [package.json, 'src/providers/**', 'src/app/**', 'src/api/**']
source: ai
supersedes: ''
related: [ship-runnable-integration-foundations]
timestamp: 2026-09-11T00:00:00+07:00
---

Include a request-safe TanStack Query provider for interactive client-side server state. Keep initial and secret-bearing reads in React Server Components, and do not duplicate Query data in another store.

Keep Redux out of the reusable baseline. Add Redux Toolkit only when a consuming project has complex global mutable client state that URL state, component state, Context, or TanStack Query does not own.
