---
id: service-local-generate-only-api-workflow
type: team_decision
title: Keep API generation service-local and expose one command
domain: frontend
tags: [template, openapi, generated-code, developer-experience]
status: proposed
enforcement: warn
applies_to: [src/api/**, package.json, .github/workflows/**]
source: human
supersedes: generated-api-includes-contract-snapshot
related: [ship-runnable-integration-foundations]
timestamp: 2026-09-11T00:00:00+07:00
---

Keep each Swagger snapshot, generated Axios client, and handwritten export together under `src/api/<service>/`. Expose only `pnpm generate` for API generation; do not add separate sync, validate, refresh, or check scripts until a real project needs those workflows. Retain `--axios` and `--unwrap-response-data`, and let tests plus CI protect the checked example and generated diff.
