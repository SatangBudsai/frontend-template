# Next.js production template

A runnable Next.js 16 foundation with React Server Components, Tailwind CSS v4, source-owned shadcn/ui, Iconify, Swagger-generated Axios clients, memory-only JWE authentication, TanStack Query, Redux Toolkit, Thai/English Tolgee localization, system-aware themes, route fallbacks, tests, and CI.

`next-themes@0.4.6` is patched through pnpm so its SSR bootstrap script is not rendered again during React 19 client remounts. This keeps no-flash theme initialization while avoiding the React client-script warning. Remove `patches/next-themes@0.4.6.patch` and its `patchedDependencies` entry after upgrading to an upstream release that includes the same fix.

Thai routes use IBM Plex Sans Thai across body, heading, control, and Thai fallback text; English routes retain Geist. The mono stack keeps Geist Mono for technical text and falls back to IBM Plex Sans Thai for Thai glyphs.

## Start

```bash
pnpm install
pnpm exec playwright install chromium
pnpm generate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Every unprefixed route receives a locale prefix: `/main` becomes `/th/main` on the first visit. The language switcher stores the choice in the `NEXT_LOCALE` cookie, so later unprefixed routes use the selected locale instead.

Tolgee remains optional because translations are bundled. The UI can render without a backend; configure `SERVICE_URL` when using the included auth flow.

TanStack Query is ready for interactive client-side server state. Redux Toolkit is ready for global mutable client state through a request-safe provider. Do not copy the same remote data into both stores.

Icons use the shared Iconify wrapper at `src/components/ui/icon.tsx`; Lucide collection IDs live in `src/config/icons.ts`. `src/config/icon-data.ts` contains only those icons as build-time generated SVG data, so deployed pages render them immediately without calling the Iconify API. `lucide-react` is not included.

## Generated API types

```bash
pnpm generate # generate the Axios client and DTOs from Swagger
```

The repository contains a minimal `example-service` contract and the connected `api-template` contract. `apiGenerated.ts` is machine-owned and must not be edited manually. Application modules import through each service folder's `index.ts`, not from `apiGenerated.ts` directly.

The auth provider bootstraps the HttpOnly refresh session, keeps access/CSRF tokens in memory, and performs a single-flight refresh plus one request retry on 401. Redux stores only auth status and the account snapshot.

## Localization

Routes always include `th` or `en`. Tracked translation files live in `langs/<namespace>/<locale>.json`; server and client integration lives in `src/tolgee`.

```bash
pnpm i18n:generate  # regenerate namespaces and source fallbacks from langs/
pnpm i18n:check     # extraction + non-mutating repository drift check
pnpm i18n:pull      # pull, update tracked code/JSON, and format
pnpm i18n:compare
pnpm i18n:push
pnpm i18n:push-force
```

Remote Tolgee credentials are optional and belong in `.env.local` or CI secrets. Without them, the same `t()` API reads bundled JSON from `langs/` and ICU formatting still works. After a successful `i18n:pull`, the command regenerates `src/tolgee/config.ts` and updates Thai fallback text in explicit `t('namespace:key', 'fallback')` calls, so the pulled state appears in the repository diff. Local JSON remains the runtime source of truth.

## Add UI components

```bash
pnpm ui:add card input dialog
```

Generated source lives in `src/components/ui` and shares `src/lib/utils.ts`.

The shadcn CLI does not currently offer Iconify as an icon-library target. Always use `pnpm ui:add`: the wrapper runs `shadcn add`, rewrites generated Lucide JSX to the shared `Icon` component, adds missing `lucide:*` IDs to `appIcons`, regenerates the offline icon bundle, removes the temporary `lucide-react` dependency, formats the result, and fails if a generated usage cannot be converted safely. `pnpm ui:check-icons` enforces the import rule without changing files and runs in CI.

When editing `appIcons` manually, run `pnpm icons:generate`. `pnpm dev` also regenerates the data before startup, while `pnpm build` and CI fail if the tracked offline bundle is stale.

## Quality checks

Playwright is the only test runner. It runs the repository contracts and real Chromium E2E coverage from the root `tests/` directory.

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm ui:check-icons
pnpm icons:check
pnpm generate
pnpm i18n:check
pnpm test
pnpm build
```

## Structure

```text
langs/                     # Tracked Tolgee namespaces by locale
src/
  api/example-service/     # Minimal standalone code-generation example
  api/api-template/        # Connected auth/RBAC contract, client, and auth transport policy
  app/[locale]/            # Locale providers and route-level boundaries
    (site)/                # Shared public site shell with landing and auth routes
  components/layout/       # Shared navbar and auth-aware account navigation
  components/auth/         # Login, registration, account, roles, and session UI
  components/ui/           # Source-owned shadcn/ui primitives
  config/icons.ts          # Project-wide Iconify icon IDs
  i18n/                    # next-intl routing and navigation
  providers/               # Request-safe client provider boundaries
  store/                   # Redux store factory and typed hooks
  tolgee/                  # Shared, server, and client Tolgee integration
scripts/icons/             # Offline Iconify subset generator
scripts/tolgee/            # Extractor and pull-to-repository synchronizer
scripts/shadcn/             # Safe shadcn add wrapper with Iconify conversion
tests/                     # Playwright browser E2E, contract, and architecture tests
.github/workflows/         # CI quality gate
```

See [authentication](docs/recipes/authentication.md), [testing](docs/recipes/testing.md), [OpenAPI code generation](docs/recipes/openapi-codegen.md), [TanStack Query](docs/recipes/tanstack-query.md), [Redux Toolkit](docs/recipes/redux-toolkit.md), [Iconify](docs/recipes/iconify.md), [Tolgee localization](docs/recipes/tolgee.md), and [template setup](docs/template-setup.md) for adoption details.
