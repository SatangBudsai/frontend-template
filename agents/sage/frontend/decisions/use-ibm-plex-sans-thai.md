---
id: use-ibm-plex-sans-thai
type: team_decision
title: Use IBM Plex Sans Thai for Thai locale routes
domain: frontend
tags: [typography, thai, font, localization]
status: proposed
enforcement: warn
applies_to: ['src/app/[locale]/layout.tsx', src/app/globals.css]
source: human
supersedes: ''
related: []
timestamp: 2026-09-12T00:00:00+07:00
---

Use IBM Plex Sans Thai as the primary font for Thai locale routes and Geist as the primary font for English locale routes. Configure both once through `next/font` and expose them through the shared `font-thai` and `font-sans` theme tokens.

Do not simulate shorter Thai glyphs with global `line-height` overrides or `transform: scaleY()`: line height changes spacing rather than letterforms, while transforms also distort component geometry and hit areas.
