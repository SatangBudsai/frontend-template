---
id: keep-provider-integrations-optional
type: team_decision
title: Keep provider integrations optional
domain: frontend
tags: [template, openapi, i18n, dependencies]
status: proposed
enforcement: advise
applies_to: [package.json, 'src/lib/api/**', 'src/tolgee/**', 'docs/recipes/**']
source: ai
supersedes: ''
related: [own-shadcn-component-source]
timestamp: 2026-09-11T00:00:00+07:00
---

Keep integrations that require an external contract, account, secret, or routing decision out of the base runtime. Provide an opt-in recipe with explicit dependencies, ownership boundaries, failure handling, and acceptance checks instead.

For generated clients, isolate generated files behind an application-owned wrapper. For localization, keep server and client modules separate and choose locale routing before adding the provider.
