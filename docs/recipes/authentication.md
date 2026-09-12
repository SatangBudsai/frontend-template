# Authentication

Set the NestJS origin in `.env.local`:

```dotenv
SERVICE_URL=http://localhost:9000
```

Next.js rewrites same-origin browser requests from `/api/*` to this server-only URL. This avoids exposing an infrastructure hostname and keeps the refresh cookie on the browser-facing path.

## Included UI flow

The runnable reference is available at `/th/auth` and `/en/auth`:

- `src/app/[locale]/(site)/layout.tsx` owns the shared landing/auth shell.
- `src/components/layout/auth-navigation.tsx` changes the navbar sign-in action into an account dropdown after authentication.
- `src/components/auth/auth-forms.tsx` implements sign-in and registration with React Hook Form.
- `src/components/auth/account-dashboard.tsx` displays roles/permissions and manages sessions/logout scope with TanStack Query.

`AuthProvider` bootstraps the session once when the app mounts. Additional client components use the same hook and reuse project UI primitives:

```tsx
'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/auth-provider'

export function SignOutButton() {
  const { status, logout } = useAuth()
  if (status !== 'authenticated') return null

  return <Button onClick={() => void logout()}>Sign out</Button>
}
```

The generated `apiTemplate` client adds the access JWE to protected endpoints. Concurrent `401` responses share one refresh promise and retry each original request at most once.

```tsx
const roles = useQuery({
  queryKey: ['roles'],
  queryFn: () => apiTemplate.api.rolesControllerList()
})
```

Security boundaries:

- The refresh token is an HttpOnly cookie and is unreadable to React.
- JWE and CSRF values stay in module memory, not localStorage, cookies readable by JavaScript, Redux, or persisted Query cache.
- Redux owns auth lifecycle/account display state; TanStack Query owns normal API server state.
- Route guards and hidden controls improve UX only. NestJS permissions remain authoritative.
