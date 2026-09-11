---
id: pulled-translations-update-repository-source
type: team_decision
title: Pulled translations update tracked catalogs and source fallbacks
domain: frontend
tags: [tolgee, i18n, code-generation, developer-workflow]
status: proposed
enforcement: warn
applies_to: ['langs/**', 'scripts/tolgee/**', 'src/tolgee/**', 'src/**/*.{ts,tsx}', package.json]
source: human
supersedes: ''
related: [ship-runnable-integration-foundations]
timestamp: 2026-09-11T00:00:00+07:00
---

A successful Tolgee pull must leave the repository fully synchronized: update tracked locale JSON, generate the namespace/static-import manifest, prefer Thai when rewriting explicit in-source fallback text, and format the resulting diff. Remote failure must stop before post-processing, while CI uses a non-mutating check to detect stale generated code or fallbacks.

Keep explicit `namespace:key` calls so extraction and source updates are deterministic. The workflow may update owned translation call fallbacks, but it must not patch global fetch or change language during React render.
