# Testing with Playwright

Playwright is the repository's only test runner. All tests live in root `tests/`:

- `frontend.e2e.spec.ts` drives Chromium through locale routing, language persistence, and theme persistence.
- `*.test.ts` uses Playwright assertions for fast repository contract and architecture checks.

Install the browser once per machine, then run the suite:

```bash
pnpm exec playwright install chromium
pnpm test
```

`playwright.config.ts` starts the Next.js development server automatically. CI installs Chromium with its Linux system dependencies before running the same `pnpm test` command.

Keep user-visible journeys in browser tests. Fast deterministic contracts may read repository files directly, but must still use Playwright's runner and assertions so the template has one test toolchain.
