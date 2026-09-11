'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  function toggleTheme() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      className='size-11'
      variant='outline'
      size='icon-lg'
      onClick={toggleTheme}
      aria-label='Toggle color theme'
      title='Toggle color theme'>
      <Sun className='dark:hidden' aria-hidden='true' />
      <Moon className='hidden dark:block' aria-hidden='true' />
    </Button>
  )
}
