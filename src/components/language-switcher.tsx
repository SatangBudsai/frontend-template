'use client'

import { useTolgee } from '@tolgee/react'
import { useTransition } from 'react'

import { usePathname, useRouter } from '@/i18n/navigation'
import { defaultLocale, isAppLocale } from '@/i18n/routing'

type LanguageSwitcherProps = {
  label: string
  thaiLabel: string
  englishLabel: string
}

export function LanguageSwitcher({ label, thaiLabel, englishLabel }: LanguageSwitcherProps) {
  const tolgee = useTolgee(['language'])
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const language = tolgee.getLanguage()
  const currentLocale = language && isAppLocale(language) ? language : defaultLocale

  return (
    <label className='relative'>
      <span className='sr-only'>{label}</span>
      <select
        className='min-h-11 appearance-none rounded-lg border border-border bg-background py-2 pr-8 pl-3 text-sm font-medium text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-wait disabled:opacity-60'
        value={currentLocale}
        disabled={isPending}
        aria-label={label}
        onChange={event => {
          const locale = event.target.value

          if (!isAppLocale(locale)) return

          startTransition(() => router.replace(pathname, { locale }))
        }}>
        <option value='th'>{thaiLabel}</option>
        <option value='en'>{englishLabel}</option>
      </select>
      <span
        className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground'
        aria-hidden='true'>
        ↓
      </span>
    </label>
  )
}
