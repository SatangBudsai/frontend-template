'use client'

import { useTolgee } from '@tolgee/react'
import { useTransition } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
    <Select
      value={currentLocale}
      disabled={isPending}
      onValueChange={locale => {
        if (!locale || !isAppLocale(locale)) return

        startTransition(() => router.replace(pathname, { locale }))
      }}>
      <SelectTrigger className='min-h-11 w-24' aria-label={label}>
        <SelectValue>{currentLocale === 'th' ? thaiLabel : englishLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent align='end' alignItemWithTrigger={false} className='min-w-32'>
        <SelectItem value='th'>{thaiLabel}</SelectItem>
        <SelectItem value='en'>{englishLabel}</SelectItem>
      </SelectContent>
    </Select>
  )
}
