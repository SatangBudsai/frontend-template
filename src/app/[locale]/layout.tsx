import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'

import { ThemeProvider } from '@/components/theme-provider'
import { routing } from '@/i18n/routing'
import { QueryProvider } from '@/providers/query-provider'
import { ReduxProvider } from '@/providers/redux-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { TolgeeNextProvider } from '@/tolgee/client'
import { getTolgee, getTranslate } from '@/tolgee/server'

import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslate()

  return {
    title: t('common:metadata.title', 'เทมเพลต Next.js สำหรับงานจริง'),
    description: t(
      'common:metadata.description',
      'โครงเริ่มต้น Next.js สำหรับ production พร้อม type จาก OpenAPI และระบบภาษาไทย/อังกฤษ'
    )
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const tolgee = await getTolgee()
  const staticData = await tolgee.loadRequired()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <NextIntlClientProvider locale={locale} messages={{}}>
          <TolgeeNextProvider language={locale} staticData={staticData}>
            <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
              <ReduxProvider>
                <QueryProvider>
                  <AuthProvider>{children}</AuthProvider>
                </QueryProvider>
              </ReduxProvider>
            </ThemeProvider>
          </TolgeeNextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
