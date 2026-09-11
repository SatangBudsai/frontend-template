---
id: ship-runnable-integration-foundations
type: team_decision
title: Ship selected integrations as runnable foundations
domain: frontend
tags: [template, openapi, i18n, tolgee, developer-experience]
status: proposed
enforcement: advise
applies_to: [package.json, 'src/api/**', 'src/i18n/**', 'src/tolgee/**', 'docs/recipes/**']
source: human
supersedes: keep-provider-integrations-optional
related: [own-shadcn-component-source]
timestamp: 2026-09-11T00:00:00+07:00
---

When an integration is selected for the reusable template, include a visible, runnable, offline-safe implementation instead of documentation alone. External accounts, secrets, production endpoints, authentication, and domain-specific operations remain project decisions.

Generated clients stay behind an application-owned wrapper. Localization keeps URL routing, server translation, client hydration, and provider credentials in separate boundaries. The checked-in example contract and translations must make the clone installable and testable without network services.
