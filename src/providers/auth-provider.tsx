'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo } from 'react'

import { authSessionClient } from '@/api/api-template'
import type { LoginDto, LogoutDto, RegisterDto } from '@/api/api-template'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { authStarted, authUnavailable, sessionCleared, sessionReceived } from '@/store/auth-slice'

interface AuthActions {
  login(input: LoginDto): Promise<void>
  register(input: RegisterDto): Promise<void>
  logout(scope?: LogoutDto['scope']): Promise<void>
}

const AuthActionsContext = createContext<AuthActions | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    let active = true
    dispatch(authStarted())
    void authSessionClient
      .bootstrap()
      .then(session => {
        if (active) dispatch(sessionReceived(session.account))
      })
      .catch(error => {
        if (!active) return
        const status =
          error && typeof error === 'object' && 'response' in error
            ? (error as { response?: { status?: number } }).response?.status
            : undefined
        dispatch(status === 401 ? sessionCleared() : authUnavailable())
      })
    return () => {
      active = false
    }
  }, [dispatch])

  const actions = useMemo<AuthActions>(
    () => ({
      async login(input) {
        const session = await authSessionClient.login(input)
        dispatch(sessionReceived(session.account))
      },
      async register(input) {
        const session = await authSessionClient.register(input)
        dispatch(sessionReceived(session.account))
      },
      async logout(scope) {
        await authSessionClient.logout(scope)
        dispatch(sessionCleared())
      }
    }),
    [dispatch]
  )

  return <AuthActionsContext.Provider value={actions}>{children}</AuthActionsContext.Provider>
}

export function useAuth() {
  const actions = useContext(AuthActionsContext)
  const state = useAppSelector(current => current.auth)
  if (!actions) throw new Error('useAuth must be used inside AuthProvider.')
  return { ...state, ...actions }
}
