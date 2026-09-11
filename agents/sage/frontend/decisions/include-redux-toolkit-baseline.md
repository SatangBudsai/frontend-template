---
id: include-redux-toolkit-baseline
type: team_decision
title: Include Redux Toolkit in the reusable baseline
domain: frontend
tags: [template, state-management, redux, tanstack-query]
status: proposed
enforcement: advise
applies_to: [package.json, 'src/providers/**', 'src/store/**', 'src/app/**']
source: human
supersedes: use-query-without-redux-baseline
related: [ship-runnable-integration-foundations]
timestamp: 2026-09-12T00:00:00+07:00
---

Ship Redux Toolkit, React Redux, a per-provider store factory, and typed hooks in the reusable template because global mutable client state is common across consuming projects.

Keep Redux and TanStack Query ownership separate. Query owns remote server state; Redux owns shared mutable browser state. Never export a module-level store from an App Router application because it can leak state across server requests.
