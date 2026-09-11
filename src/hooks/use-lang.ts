'use client'

import { useTolgee, useTranslate } from '@tolgee/react'
import { useMemo } from 'react'

import { defaultLocale, isAppLocale } from '@/i18n/routing'
import { createNamespacedTranslate } from '@/tolgee/translate'

export function useLang() {
  const { t: tolgeeTranslate } = useTranslate()
  const tolgee = useTolgee(['language'])
  const t = useMemo(() => createNamespacedTranslate(tolgeeTranslate), [tolgeeTranslate])
  const language = tolgee.getLanguage()
  const lang = language && isAppLocale(language) ? language : defaultLocale

  return { t, lang }
}
