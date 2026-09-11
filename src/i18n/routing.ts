import { defineRouting } from 'next-intl/routing'

export const locales = ['th', 'en'] as const
export type AppLocale = (typeof locales)[number]

export const defaultLocale: AppLocale = 'th'

export function isAppLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value)
}

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always'
})
