# Template Production Foundation Flow

> Design record for adding production-safe defaults and optional integration recipes to the reusable Next.js template.

> Superseded for OpenAPI and Tolgee activation by `active-openapi-tolgee-flow.md`; retained as the earlier baseline decision record.

## 1. Design decisions

- Keep the base application runnable without an API, translation service, account, or secret.
- Add only cross-project runtime defaults to the base: system-aware color theme, route failure states, and CI quality checks.
- Document OpenAPI client generation and Tolgee localization as opt-in recipes with explicit dependency and file boundaries.
- Keep generated API files replaceable and prevent application code from importing generated internals directly.
- Keep translation namespaces feature-oriented and avoid global fetch patches or language changes during render.

## 2. Actors and ownership

| Actor/System   | Responsibility                                          | Owned boundary                                   |
| -------------- | ------------------------------------------------------- | ------------------------------------------------ |
| Next.js app    | Render routes, theme, and route-level fallback UI       | `src/app/**`, `src/components/**`                |
| `next-themes`  | Resolve and persist the selected browser color scheme   | Root theme provider only                         |
| GitHub Actions | Reproduce repository quality checks                     | `.github/workflows/quality.yml`                  |
| API provider   | Publish an OpenAPI document                             | External URL configured by the consuming project |
| API generator  | Replace generated client types/source                   | A dedicated generated directory                  |
| Tolgee         | Manage translation resources when the recipe is enabled | Project-defined i18n boundary and locale files   |

## 3. End-to-end flow

```text
[Clone template]
      |
      v
[Install dependencies] --> [Run base app with light/dark/system theme]
      |                                  |
      v                                  v
[Quality workflow]             [loading/error/not-found boundaries]
      |
      +--> Optional OpenAPI recipe --> sync -> validate -> generate -> import through wrapper
      |
      +--> Optional Tolgee recipe  --> load locale namespaces -> server/client translators
```

## 4. Runtime behavior

1. The root layout renders with a stable server-safe theme provider.
2. The browser resolves `light`, `dark`, or the operating-system preference; the toggle remains labelled while hydration completes.
3. A missing route renders `not-found.tsx`; a route error renders `error.tsx`; a root failure renders `global-error.tsx` with its own document shell.
4. Pull requests and pushes run the same non-mutating checks documented for local development.

## 5. Optional OpenAPI lifecycle

1. A project opts in and installs the documented generator dependencies.
2. The sync script downloads the configured specification to a temporary file.
3. The script validates that the response is JSON and contains an OpenAPI or Swagger version before atomically replacing the checked-in specification.
4. Generation replaces only the generated directory.
5. Application code imports a stable wrapper, not generator-specific internals.
6. CI runs the contract test before accepting regenerated output.

## 6. Optional Tolgee lifecycle

1. A project chooses URL-based locale routing for public sites or cookie-based locale selection for internal applications.
2. Translation JSON is grouped by feature namespace and locale.
3. Server components use a server translator; client components use the client provider/hooks.
4. Development credentials remain in local environment files; production locale files are available without exposing a secret key.

## 7. Failure handling

| Failure                         | Expected behavior                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| Theme script has not hydrated   | Render a disabled, labelled toggle without guessing the active theme               |
| Segment render fails            | Show a retry action without exposing internal error details                        |
| Root layout fails               | Render a complete fallback `<html>` and `<body>` document                          |
| OpenAPI fetch is not successful | Keep the previous specification and fail the sync command                          |
| Downloaded contract is invalid  | Reject it before replacing the existing contract                                   |
| Tolgee credentials are absent   | Production remains able to use bundled locale data; in-context editing is disabled |

## 8. Security and supply-chain controls

- No secrets, backend mutations, or generated clients are added to the base template.
- Pin runtime package versions in `package.json` and record exact resolutions in `pnpm-lock.yaml`.
- Give the CI token read-only repository permissions.
- Treat remote API specifications and translation data as untrusted input and validate them at their boundaries.
- Do not patch `globalThis.fetch` or leak server-only environment variables into client bundles.

## 9. Build checklist

- [x] `PROD-01` Theme runtime — system preference works and the root layout avoids hydration warnings.
- [x] `PROD-02` Route boundaries — loading, not-found, segment error, and global error files compile.
- [x] `PROD-03` CI — the workflow runs install, formatting, lint, typecheck, tests, and build.
- [x] `PROD-04` OpenAPI recipe — sync, validation, generated-code boundary, and commands are documented.
- [x] `PROD-05` Tolgee recipe — routing choice, namespaces, server/client split, and environment contract are documented.
- [x] `PROD-06` Validation — local formatting, lint, typecheck, tests, and production build pass.

## 10. Out of scope

- Selecting a backend URL or committing a generated domain client.
- Forcing every consumer into a `[locale]` route hierarchy.
- Adding authentication, a database, global state, query caching, forms, or deployment infrastructure to the base.
- Committing repository changes.

## 11. Open questions

There are no blocking questions. API schema details and locale routing are intentionally deferred until each optional recipe is enabled by a consuming project.

**Verification verdict:** `design-clear` — ownership, trust boundaries, failure paths, optional feature boundaries, and validation requirements are explicit.
