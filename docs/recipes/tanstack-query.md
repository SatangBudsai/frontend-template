# TanStack Query client data flow

> This guide describes the included TanStack Query foundation for client-side server state. It references the template source as of September 12, 2026 and keeps React Server Components as the default read path.

## 1. Actors & Systems

| System               | Responsibility                                                | Ownership                          |
| -------------------- | ------------------------------------------------------------- | ---------------------------------- |
| Server Component     | Load data needed for the initial server render                | `src/app/**`                       |
| Query provider       | Own the browser query cache and isolate server requests       | `src/providers/query-provider.tsx` |
| Client Component     | Poll, refetch, paginate, or optimistically update remote data | Feature-owned component            |
| Generated API client | Execute typed Axios requests                                  | `src/api/<service>/**`             |

**Trust boundary:** only `NEXT_PUBLIC_` values can reach the browser. Server credentials stay in server-only modules and must not be passed into query functions.

## 2. End-to-end overview

```text
[Server Component] choose the data owner
   │
   ├─(A) initial/server-only read → call the backend on the server → render HTML
   └─(B) interactive client state → render a Client Component under QueryProvider
                                      │
                                      ▼ useQuery({ queryKey, queryFn })
                              [TanStack Query] check browser cache
                                      │
                                      ├─ fresh → return cached data
                                      └─ stale/missing → generated Axios client → backend
```

**Key:** TanStack Query manages remote state needed by Client Components; it does not replace Server Component data fetching or local UI state.

## 3. Step-by-step

### STEP 1 — Keep the provider request-safe

**System:** Query provider

- `environmentManager.isServer()` creates a new `QueryClient` for every server render.
- The browser reuses one `QueryClient` so navigation does not discard its cache.
- A default `staleTime` of 60 seconds prevents an immediate client refetch after server rendering.

### STEP 2 — Define a stable query

**System:** Feature module + generated API client

- Use a serializable, hierarchical key such as `['example-service', 'health']`.
- Call the application-owned service export rather than `apiGenerated.ts` directly.
- Keep authentication and secret-bearing requests on the server.

```tsx
'use client'

import { useQuery } from '@tanstack/react-query'

import { exampleService } from '@/api/example-service'

export function ServiceHealth() {
  const health = useQuery({
    queryKey: ['example-service', 'health'],
    queryFn: () => exampleService.health.getHealth()
  })

  if (health.isPending) return <p>Loading...</p>
  if (health.isError) return <p role='alert'>Unable to load service health.</p>

  return <p>{health.data.status}</p>
}
```

### STEP 3 — Invalidate after a mutation

**System:** Client Component + TanStack Query

- Use `useMutation` only for a mutation that must execute from the browser.
- On success, invalidate the smallest affected query-key prefix.
- Prefer a Server Action when the mutation does not require browser-owned orchestration.

## 4. State lifecycle

| State                         | Owner                     | Lifetime                                |
| ----------------------------- | ------------------------- | --------------------------------------- |
| Initial server data           | Server Component          | Current render/cache policy             |
| Remote client data            | QueryClient               | Browser session until garbage-collected |
| Form/input state              | Component or form library | Component/feature lifetime              |
| Global mutable workflow state | Redux Toolkit             | Browser lifetime under `ReduxProvider`  |

Do not copy Query data into Redux or Context. That creates two sources of truth for the same server state.

## 5. API contract

The template does not add a new HTTP endpoint. Query functions call the generated service client described in [`openapi-codegen.md`](openapi-codegen.md).

- `NEXT_PUBLIC_SERVICE` must be set before importing and using `exampleService`.
- A missing value throws `NEXT_PUBLIC_SERVICE is required before using exampleService.`
- No backend is required to render the starter page because it does not import the example service.

## 8. Edge cases & errors

| Case                           | Handling                                                                    |
| ------------------------------ | --------------------------------------------------------------------------- |
| Query data is fresh            | Return cached data without another request                                  |
| Query data is stale            | Refetch according to the component's query policy                           |
| API base URL is missing        | Fail at the service wrapper with a clear configuration error                |
| Request fails                  | Render the component's explicit error state; do not expose internal details |
| Server render handles the read | Do not add `useQuery`; keep the request in the Server Component             |

## 9. Security & concurrency

- Never expose a server credential through `NEXT_PUBLIC_` variables or a browser query function.
- Query keys must describe request identity without containing tokens or personal data.
- Mutations must tolerate retries when the backend operation can be repeated.
- Redux Toolkit is part of the baseline for global mutable client state. Keep TanStack Query as the only owner of the same remote data.

## 10. Build checklist

- [ ] Put the Client Component below `QueryProvider`.
- [ ] Use the generated service wrapper rather than generated internals.
- [ ] Set `NEXT_PUBLIC_SERVICE` when the client query calls the example backend.
- [ ] Provide pending, error, empty, and success UI where each state applies.
- [ ] Run `pnpm test`, `pnpm typecheck`, and `pnpm build`.

## 11. Open questions

None for the baseline. Query retry, stale time, persistence, and mutation policy belong to each feature.
