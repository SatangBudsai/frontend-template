'use client'

import { useState } from 'react'

import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { appIcons } from '@/config/icons'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/auth-provider'

type AuthNavigationProps = {
  signInLabel: string
  accountMenuLabel: string
  manageAccountLabel: string
  logoutLabel: string
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('')
}

export function AuthNavigation({
  signInLabel,
  accountMenuLabel,
  manageAccountLabel,
  logoutLabel
}: AuthNavigationProps) {
  const { status, account, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (status === 'loading') return <Skeleton className='h-11 w-20' aria-label={accountMenuLabel} />

  if (status !== 'authenticated' || !account) {
    if (pathname === '/auth') return null

    return (
      <Link className={cn(buttonVariants({ size: 'lg' }), 'min-h-11 px-4')} href='/auth'>
        {signInLabel}
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant='outline' size='lg' className='min-h-11 gap-2 px-2 sm:px-3' aria-label={accountMenuLabel}>
            <Avatar size='sm'>
              <AvatarFallback>{initials(account.name) || 'U'}</AvatarFallback>
              <AvatarBadge />
            </Avatar>
            <span className='hidden max-w-28 truncate sm:inline'>{account.name}</span>
            <Icon
              icon={appIcons.chevronDown}
              className='hidden size-4 text-muted-foreground sm:block'
              aria-hidden='true'
            />
          </Button>
        }
      />
      <DropdownMenuContent align='end' className='w-64'>
        <DropdownMenuLabel className='space-y-0.5'>
          <span className='block truncate text-foreground'>{account.name}</span>
          <span className='block truncate font-normal'>{account.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/auth')}>
          <Icon icon={appIcons.security} aria-hidden='true' />
          {manageAccountLabel}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant='destructive'
          disabled={isLoggingOut}
          onClick={() => {
            setIsLoggingOut(true)
            void logout().catch(() => undefined)
          }}>
          <Icon icon={appIcons.logout} aria-hidden='true' />
          {logoutLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
