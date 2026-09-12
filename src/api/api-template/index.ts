import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

import { Api } from './apiGenerated'
import type { AuthSessionResponseDto, LoginDto, LogoutDto, RegisterDto } from './apiGenerated'

let csrfToken: string | undefined
let refreshInFlight: Promise<AuthSessionResponseDto> | undefined

export const apiTemplate = new Api<string>({
  baseURL: '',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  securityWorker: token =>
    token
      ? {
          headers: { Authorization: `Bearer ${token}` }
        }
      : {}
})

function applySession(session: AuthSessionResponseDto): AuthSessionResponseDto {
  csrfToken = session.csrfToken
  apiTemplate.setSecurityData(session.accessToken)
  return session
}

function clearSession(): void {
  csrfToken = undefined
  apiTemplate.setSecurityData(null)
}

function isLifecycleRequest(url: string | undefined): boolean {
  return /\/api\/auth\/(?:bootstrap|login|logout|refresh|register)$/.test(url ?? '')
}

async function recoverSession(): Promise<AuthSessionResponseDto> {
  refreshInFlight ??= (
    csrfToken
      ? apiTemplate.api.accountControllerRefresh({ headers: { 'x-csrf-token': csrfToken } })
      : apiTemplate.api.accountControllerBootstrap()
  )
    .then(applySession)
    .catch(error => {
      clearSession()
      throw error
    })
    .finally(() => {
      refreshInFlight = undefined
    })
  return refreshInFlight
}

interface RetryableRequest extends InternalAxiosRequestConfig {
  authRetry?: boolean
}

apiTemplate.instance.interceptors.response.use(undefined, async (error: AxiosError) => {
  const request = error.config as RetryableRequest | undefined
  if (error.response?.status !== 401 || !request || request.authRetry || isLifecycleRequest(request.url)) {
    throw error
  }

  request.authRetry = true
  const session = await recoverSession()
  request.headers.set('Authorization', `Bearer ${session.accessToken}`)
  return apiTemplate.instance.request(request)
})

export const authSessionClient = {
  bootstrap(): Promise<AuthSessionResponseDto> {
    return recoverSession()
  },

  login(input: LoginDto): Promise<AuthSessionResponseDto> {
    return apiTemplate.api.accountControllerLogin(input).then(applySession)
  },

  register(input: RegisterDto): Promise<AuthSessionResponseDto> {
    return apiTemplate.api.accountControllerRegister(input).then(applySession)
  },

  async logout(scope: LogoutDto['scope'] = 'CURRENT_DEVICE'): Promise<void> {
    try {
      await apiTemplate.api.accountControllerLogout(
        { scope },
        csrfToken ? { headers: { 'x-csrf-token': csrfToken } } : {}
      )
    } finally {
      clearSession()
    }
  },

  clear: clearSession
}

export * from './apiGenerated'
