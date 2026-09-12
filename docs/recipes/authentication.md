# Authentication

Set the NestJS origin in `.env.local`:

```dotenv
SERVICE_URL=http://localhost:9000
```

Next.js rewrites browser requests from same-origin `/api/*` to this server-only URL. This avoids exposing an infrastructure hostname and ensures the refresh cookie path matches the browser request path.

`AuthProvider` performs one bootstrap when the app mounts. Use its hook from a client component:

```tsx
'use client'

import { useAuth } from '@/providers/auth-provider'

export function SignInButton() {
  const { status, account, login, logout } = useAuth()

  if (status === 'loading') return <span>Loading…</span>
  if (status === 'authenticated') {
    return <button onClick={() => void logout()}>{account?.name}: sign out</button>
  }

  return <button onClick={() => void login({ email: 'user@example.com', password: 'your-passphrase' })}>Sign in</button>
}
```

The generated `apiTemplate` client adds the access JWE to protected endpoints. Multiple concurrent 401 responses share one refresh promise and retry each original request at most once.

```tsx
const roles = useQuery({
  queryKey: ['roles'],
  queryFn: () => apiTemplate.api.rolesControllerList()
})
```

Security boundaries:

- The raw refresh token is an HttpOnly cookie and is unreadable to React.
- JWE and CSRF values stay in module memory, not localStorage, cookies readable by JavaScript, Redux, or persisted Query cache.
- Redux owns auth lifecycle/account display state; TanStack Query owns normal API server state.
- Route guards improve UX only. NestJS permissions remain authoritative.
