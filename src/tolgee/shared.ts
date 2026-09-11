import { FormatIcu } from '@tolgee/format-icu'
import { DevTools, Tolgee } from '@tolgee/web'

import { defaultLocale, locales } from '@/i18n/routing'

import { defaultNamespace, namespaces, staticData } from './config'

export function TolgeeBase() {
  const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY
  const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL
  const enableDevTools = process.env.NEXT_PUBLIC_TOLGEE_DEVTOOLS === 'true'
  const builder = Tolgee().use(FormatIcu())
  const useRemoteDevelopment = process.env.NODE_ENV === 'development' && enableDevTools && apiKey && apiUrl

  if (useRemoteDevelopment) {
    builder.use(DevTools())
  }

  return builder.updateDefaults({
    defaultLanguage: defaultLocale,
    fallbackLanguage: 'en',
    availableLanguages: [...locales],
    availableNs: [...namespaces],
    defaultNs: defaultNamespace,
    ns: [...namespaces],
    staticData,
    ...(useRemoteDevelopment ? { apiKey, apiUrl } : {})
  })
}
