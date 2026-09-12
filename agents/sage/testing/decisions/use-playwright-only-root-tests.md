---
title: Use Playwright as the only test runner
domain: testing
status: proposed
enforcement: warn
applies_to: [testing, "tests/**", "playwright.config.ts"]
source: human
---

Keep every test in root `tests/` and run it with Playwright. Frontend user journeys use Chromium; deterministic repository contracts may use Node filesystem utilities but still use Playwright's runner and assertions. Add a second runner only after a measured unit-test performance need appears.
