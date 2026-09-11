import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'

import { isAppLocale, localeCookie, resolvePreferredLocale, routing } from '@/i18n/routing'

export default function proxy(request: NextRequest) {
  const pathnameLocale = request.nextUrl.pathname.split('/')[1]
  const savedLocale = request.cookies.get(localeCookie.name)?.value
  const preferredLocale = resolvePreferredLocale(request.nextUrl.pathname, savedLocale)

  const response = createMiddleware({ ...routing, defaultLocale: preferredLocale })(request)

  if (isAppLocale(pathnameLocale)) {
    response.cookies.set(localeCookie.name, pathnameLocale, {
      maxAge: localeCookie.maxAge,
      path: '/',
      sameSite: 'lax'
    })
  }

  return response
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
}
