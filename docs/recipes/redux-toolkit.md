# Redux Toolkit global client state

Redux Toolkit is included for mutable client state that must be shared across unrelated features. TanStack Query remains the owner of remote server data.

## Structure

```text
src/
  providers/redux-provider.tsx  # Creates one store per provider instance
  store/store.ts                # Store factory and inferred types
  store/hooks.ts                # Typed React Redux hooks
  store/features/               # Add feature-owned slices here
```

The locale layout mounts `ReduxProvider` once around route content. The provider calls `makeStore` through a lazy `useState` initializer, so a module-level singleton is never shared across server requests.

## Add a feature slice

```ts
// src/store/features/sidebar/sidebar-slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: { open: false },
  reducers: {
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.open = action.payload
    }
  }
})

export const { setSidebarOpen } = sidebarSlice.actions
export const sidebarReducer = sidebarSlice.reducer
```

Register the reducer in `src/store/store.ts`, then use `useAppDispatch`, `useAppSelector`, and `useAppStore` from `src/store/hooks.ts` in Client Components. Do not use Redux hooks in React Server Components.

## State ownership

| State                                                          | Owner                               |
| -------------------------------------------------------------- | ----------------------------------- |
| Remote cache, refetching, polling, optimistic server mutations | TanStack Query                      |
| Global mutable browser workflow or UI state                    | Redux Toolkit                       |
| URL filters, pagination, and shareable selections              | Next.js route/search params         |
| Local form or component interaction                            | Component state or the form library |

Never mirror Query data into Redux. Two owners for the same remote data create stale and conflicting state.
