'use client'

import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { appIcons } from '@/config/icons'

const subscribeToHydration = () => () => undefined
const getClientHydrationSnapshot = () => true
const getServerHydrationSnapshot = () => false

export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const isHydrated = useSyncExternalStore(subscribeToHydration, getClientHydrationSnapshot, getServerHydrationSnapshot)

  function toggleTheme() {
    const currentTheme = resolvedTheme ?? (document.documentElement.classList.contains('dark') ? 'dark' : 'light')

    setTheme(currentTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      className='size-11'
      variant='outline'
      size='icon-lg'
      disabled={!isHydrated}
      onClick={toggleTheme}
      aria-label={label}
      title={label}>
      <Icon icon={appIcons.lightMode} className='size-5 dark:hidden' aria-hidden='true' />
      <Icon icon={appIcons.darkMode} className='hidden size-5 dark:block' aria-hidden='true' />
    </Button>
  )
}
