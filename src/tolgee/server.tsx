import { createServerInstance } from '@tolgee/react/server'
import { getLocale } from 'next-intl/server'

import { TolgeeBase } from './shared'
import { createNamespacedTranslate } from './translate'

const serverInstance = createServerInstance({
  getLocale,
  createTolgee: async language =>
    TolgeeBase().init({
      language,
      observerOptions: { fullKeyEncode: true }
    })
})

export const { getTolgee, T } = serverInstance

export async function getTranslate() {
  return createNamespacedTranslate(await serverInstance.getTranslate())
}
