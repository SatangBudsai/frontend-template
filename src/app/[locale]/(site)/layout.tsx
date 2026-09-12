import type { ReactNode } from 'react'

import { SiteHeader } from '@/components/layout/site-header'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className='relative min-h-svh overflow-hidden bg-background text-foreground'>
      <div className='template-grid pointer-events-none absolute inset-0 opacity-65' aria-hidden='true' />
      <div
        className='pointer-events-none absolute top-0 right-0 size-[32rem] translate-x-1/3 -translate-y-1/3 rounded-full bg-foreground/4 blur-3xl'
        aria-hidden='true'
      />
      <div className='relative mx-auto flex min-h-svh w-full max-w-6xl flex-col px-5 sm:px-10 lg:px-12'>
        <SiteHeader />
        {children}
      </div>
    </div>
  )
}
