---
id: prefix-paths-with-saved-locale
type: team_decision
title: Prefix unlocalized paths with the saved locale
domain: frontend
tags: [template, i18n, routing, cookie]
status: proposed
enforcement: warn
applies_to: ['src/i18n/**', src/proxy.ts, 'src/components/language-switcher.tsx']
source: human
supersedes: ''
related: [pulled-translations-update-repository-source]
timestamp: 2026-09-12T00:00:00+07:00
---

Route every unlocalized pathname through the global proxy and preserve the full pathname and query when adding the locale prefix. Use Thai for the first visit, then use a one-year `NEXT_LOCALE` cookie for later unprefixed requests.

Do not use `localStorage` as the routing source because the server proxy cannot read it before rendering. Explicit locale URLs remain canonical and update the cookie centrally.
