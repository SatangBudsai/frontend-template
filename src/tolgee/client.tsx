'use client'

import type { CachePublicRecord, TolgeeStaticData } from '@tolgee/react'
import { TolgeeProvider } from '@tolgee/react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { TolgeeBase } from './shared'

type TolgeeNextProviderProps = {
  children: ReactNode
  language: string
  staticData: TolgeeStaticData | CachePublicRecord[]
}

const tolgee = TolgeeBase().init()

export function TolgeeNextProvider({ children, language, staticData }: TolgeeNextProviderProps) {
  const router = useRouter()

  useEffect(() => {
    const { unsubscribe } = tolgee.on('permanentChange', () => router.refresh())

    return unsubscribe
  }, [router])

  return (
    <TolgeeProvider tolgee={tolgee} fallback={null} ssr={{ language, staticData }}>
      {children}
    </TolgeeProvider>
  )
}
