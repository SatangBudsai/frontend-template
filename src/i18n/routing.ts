import { defineRouting } from 'next-intl/routing'

export const locales = ['th', 'en'] as const
export type AppLocale = (typeof locales)[number]

export const defaultLocale: AppLocale = 'th'

export const localeCookie = {
  name: 'NEXT_LOCALE',
  maxAge: 60 * 60 * 24 * 365
} as const

export function isAppLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value)
}

export function resolvePreferredLocale(pathname: string, savedLocale?: string): AppLocale {
  const pathnameLocale = pathname.split('/')[1]

  if (isAppLocale(pathnameLocale)) return pathnameLocale
  if (savedLocale && isAppLocale(savedLocale)) return savedLocale

  return defaultLocale
}

export const routing = defineRouting({
  locales,
  defaultLocale,
  localeDetection: false,
  localeCookie,
  localePrefix: 'always'
})
