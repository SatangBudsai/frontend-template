# Active OpenAPI, Tolgee, Query, and Redux Foundation Flow

> Design record for executable, domain-neutral OpenAPI, localization, state-management, and icon foundations.

## 1. Design decisions

- Keep the application runnable without a live API, Tolgee account, or secret by checking in a minimal OpenAPI contract and bundled translations.
- Match the CMU reference structure with `swagger-typescript-api` plus Axios, while co-locating each checked Swagger input with its service-specific generated client and `index.ts` runtime configuration.
- Keep machine-owned client source in `src/api/example-service/apiGenerated.ts`; application modules import the service index and never the generated file directly. Rename the example slug when adopting a real backend.
- Use locale-prefixed URLs (`/th`, `/en`) through `next-intl`; Thai is the first-visit fallback and a persistent locale cookie selects later unprefixed redirects.
- Use Tolgee for translations, with `langs/<namespace>/<locale>.json`, a shared builder, a server instance, and a client provider.
- Use TanStack Query for interactive client-side server state while keeping initial reads in React Server Components.
- Include a request-safe Redux Toolkit store factory and typed hooks for global mutable client state without duplicating Query-owned remote data.
- Use Iconify behind a shared component and central icon-ID map; do not keep a Lucide runtime dependency.
- Match the reference repository workflow: a successful pull updates tracked locale JSON, regenerates the namespace/static-import manifest, synchronizes Thai fallback text in source translation calls, and formats the result.
- Keep route navigation as the language source of truth. Never patch global fetch or call `changeLanguage` during React render.

## 2. Actors and ownership

| Actor/System            | Responsibility                                                                | Owned boundary                                         |
| ----------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------ |
| Swagger snapshot        | Provide the checked, reviewable generator input                               | `src/api/example-service/example-service.swagger.json` |
| API generator           | Deterministically generate the Axios client and DTOs                          | `src/api/example-service/apiGenerated.ts`              |
| API wrapper             | Configure and export the generated service client                             | `src/api/example-service/index.ts`                     |
| next-intl               | Negotiate and preserve locale-prefixed URLs                                   | `src/i18n/**`, `src/proxy.ts`                          |
| Tolgee server           | Load translations for Server Components and SSR                               | `src/tolgee/server.tsx`                                |
| Tolgee client           | Hydrate records and enable optional in-context editing                        | `src/tolgee/client.tsx`                                |
| Translation files       | Provide production-safe local strings and the source for code fallbacks       | `langs/<namespace>/<locale>.json`                      |
| Repository synchronizer | Validate locale files, generate namespace imports, and update source defaults | `scripts/tolgee/**`                                    |
| Query provider          | Isolate server caches and retain one browser cache                            | `src/providers/query-provider.tsx`                     |
| Redux provider          | Create one client store per rendered provider boundary                        | `src/providers/redux-provider.tsx`, `src/store/**`     |
| Iconify boundary        | Provide one icon API and centralized recurring IDs                            | `src/components/ui/icon.tsx`, `src/config/icons.ts`    |

## 3. End-to-end flow

```text
[Clone + pnpm install]
          |
          +--> generate --> checked Swagger snapshot --> generated Axios client + DTOs
          |                                           --> service index configures base URL
          |
          +--> GET /path --> proxy reads saved locale/default --> /th/path or /en/path
                                                        |
                                                        +--> locale layout validates param
                                                        +--> Tolgee server loads common namespace
                                                        +--> client provider hydrates same records
                                                        +--> language switch changes URL
          |
          +--> Client query --> QueryProvider cache --> generated Axios client --> backend
```

## 4. OpenAPI lifecycle

1. The checked-in `src/api/example-service/example-service.swagger.json` is the source used by `generate` and works offline.
2. `swagger-typescript-api generate` replaces only `src/api/example-service/apiGenerated.ts`, uses Axios, and unwraps response data.
3. The same command formats the service TypeScript files so generation leaves the repository style-consistent.
4. Application code imports the configured `exampleService` or generated DTO exports from `src/api/example-service/index.ts`; auth middleware remains a project concern.
5. Tests parse the representative contract, protect the generated-file boundary, and assert that `generate` retains the expected input/output paths and Axios flags. CI runs the command and rejects a generated diff.

## 5. Localization lifecycle

1. `src/i18n/routing.ts` declares `th`, `en`, the Thai fallback, and next-intl routing once.
2. `src/proxy.ts` redirects every unprefixed route, preserves the path/query, stores explicit locale visits in `NEXT_LOCALE`, and excludes APIs, Next internals, and files.
3. The `[locale]` root layout rejects unsupported locales, statically enumerates supported locales, loads required Tolgee records, and renders the matching `<html lang>`.
4. Server Components call `getTranslate()` before rendering copy.
5. The client provider receives serializable records only; in-context DevTools activates only in development when both public Tolgee values are present.
6. The language switcher replaces the current pathname with another locale via locale-aware navigation; the proxy persists that explicit locale for one year.
7. CLI pull/push/sync commands remain explicit; build and dev never mutate the Tolgee project.
8. `i18n:pull` loads local credentials, runs remote `tolgee pull`, and only after success runs `i18n:generate`.
9. `i18n:generate` discovers namespaces from `langs/`, ensures `th.json` and `en.json`, regenerates `src/tolgee/config.ts`, then updates the second argument of explicit `t('namespace:key', 'Thai fallback')` calls.
10. `i18n:check` performs extraction plus a non-mutating repository-sync check so CI catches stale generated namespaces or code fallbacks.

## 6. Client query lifecycle

1. The locale layout places `QueryProvider` around route content without converting Server Components into Client Components.
2. Server rendering creates an isolated `QueryClient`; browser navigation reuses one browser instance.
3. The default 60-second `staleTime` avoids an immediate browser refetch after hydration.
4. Client Components use TanStack Query only when they need cache, refetch, polling, pagination, or optimistic updates.
5. Initial reads and secret-bearing calls remain in Server Components.
6. Redux owns global mutable browser state only. Its provider lazily creates the store per mounted tree and typed hooks are exported from `src/store/hooks.ts`.
7. Query-owned remote state is never mirrored into Redux.

## 7. Failure handling

| Failure                                                          | Expected behavior                                                                                 |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Swagger file is missing or malformed                             | `generate` exits non-zero and keeps the prior generated client available for recovery through Git |
| Generated Axios client differs from the checked Swagger snapshot | CI runs `generate` and rejects the generated diff; locally rerun `pnpm generate` and review it    |
| API base URL is empty                                            | Fail service-wrapper construction with a clear local error when the runtime client is imported    |
| Unsupported locale is requested                                  | Render the locale not-found boundary                                                              |
| Tolgee credentials are absent                                    | Render bundled translations; disable in-context editing                                           |
| Translation key differs between locales                          | Fail the locale consistency test                                                                  |
| Remote Tolgee pull fails                                         | Stop before repository generation; retain the prior Git diff for review/recovery                  |
| Pulled namespace has one locale file                             | Create the missing tracked locale file, then let consistency checks report missing keys           |
| Source fallback differs from pulled Thai                         | `i18n:generate` rewrites only the fallback argument; `i18n:check` reports drift without writing   |
| Client query fails                                               | Keep the error in Query state and require the consuming component to render an explicit error UI  |
| Root layout fails                                                | Render the self-contained bilingual global error without depending on app providers or global CSS |

## 8. Security and supply-chain controls

- Pin all new packages exactly and review `pnpm-lock.yaml`.
- Never add API credentials to generated source, public environment variables, or translation files.
- Treat replacement Swagger files as untrusted input: review their origin and diff before generation, and rely on generation/tests to reject malformed examples.
- Use read-only local translation files in production; a public Tolgee key is development-only and must have least privilege.
- Do not run Tolgee mutation commands automatically during build.
- Never place tokens, credentials, or personal data in browser query keys.
- Pin TanStack Query, Redux Toolkit, React Redux, and Iconify exactly; CI validates the production build and route/provider contract tests.

## 9. Build checklist

- [x] `ACTIVE-01` Dependencies — exact compatible OpenAPI, Tolgee, and next-intl versions are recorded.
- [x] `ACTIVE-02` OpenAPI — parse the checked Swagger config, generate the service Axios client/DTOs, and pass generated-boundary tests.
- [x] `ACTIVE-03` Localization — both locale roots render, share consistent translation keys, and use explicit repository-synced fallbacks.
- [x] `ACTIVE-04` Routing — every unprefixed path receives the default or saved locale while preserving its pathname and query.
- [x] `ACTIVE-05` Documentation — README and recipes describe the active paths and pull-to-repository workflow.
- [x] `ACTIVE-06` Validation — generation check, format, lint, typecheck, tests, build, audit, and HTTP route checks pass.
- [x] `ACTIVE-07` State boundaries — request-safe TanStack Query and Redux providers are active with separate ownership.
- [x] `ACTIVE-08` Icon boundary — Iconify replaces the Lucide runtime behind one shared component.

## 10. Out of scope

- Selecting a production API URL, auth mechanism, domain-specific operation, or hosted Swagger UI.
- Connecting to a real Tolgee project, executing a credentialed pull/push, or storing credentials.
- Adding feature-specific query/mutation hooks, Redux slices, forms, database, or authentication.
- Committing or pushing Git changes.

## 11. Open questions

There are no blocking questions. The user explicitly selected the eCustom-style pull lifecycle. The implementation keeps its repository update behavior while replacing its global fetch patch, render-time language mutation, and variable dynamic imports with the existing App Router server/client boundary and generated static imports.

**Verification verdict:** `design-clear` — sources of truth, trust boundaries, runtime ownership, failure paths, and validation evidence are explicit.
