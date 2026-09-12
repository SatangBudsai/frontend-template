'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { apiTemplate } from '@/api/api-template'
import type { AuthSessionListItemDto, LogoutDto } from '@/api/api-template'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/ui/icon'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { appIcons } from '@/config/icons'
import { useLang } from '@/hooks/use-lang'
import { useAuth } from '@/providers/auth-provider'

type LogoutScope = NonNullable<LogoutDto['scope']>

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('')
}

function SessionRow({
  session,
  dateFormatter,
  onRevoke
}: {
  session: AuthSessionListItemDto
  dateFormatter: Intl.DateTimeFormat
  onRevoke(session: AuthSessionListItemDto): void
}) {
  const { t } = useLang()

  return (
    <div className='flex flex-col gap-4 py-4 sm:flex-row sm:items-center'>
      <div className='flex min-w-0 flex-1 items-start gap-3'>
        <span className='grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground'>
          <Icon icon={appIcons.devices} className='size-5' aria-hidden='true' />
        </span>
        <div className='min-w-0 space-y-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <p className='font-mono text-xs font-medium'>{session.id.slice(0, 8)}</p>
            {session.current ? (
              <Badge variant='secondary'>{t('common:auth.session.current', 'อุปกรณ์นี้')}</Badge>
            ) : null}
          </div>
          <p className='text-xs leading-5 text-muted-foreground'>
            {t('common:auth.session.lastUsed', 'ใช้ล่าสุด')} {dateFormatter.format(new Date(session.lastUsedAt))}
          </p>
          <p className='text-xs leading-5 text-muted-foreground'>
            {t('common:auth.session.expires', 'หมดอายุ')} {dateFormatter.format(new Date(session.expiresAt))}
          </p>
        </div>
      </div>
      {!session.current ? (
        <Button className='sm:self-center' variant='outline' onClick={() => onRevoke(session)}>
          {t('common:auth.action.revoke', 'ยกเลิก session')}
        </Button>
      ) : null}
    </div>
  )
}

export function AccountDashboard() {
  const { account, logout } = useAuth()
  const { t, lang } = useLang()
  const queryClient = useQueryClient()
  const [logoutScope, setLogoutScope] = useState<LogoutScope>('CURRENT_DEVICE')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [sessionToRevoke, setSessionToRevoke] = useState<AuthSessionListItemDto | null>(null)
  const [revokeError, setRevokeError] = useState<string | null>(null)

  const sessions = useQuery({
    queryKey: ['auth', 'sessions', account?.id],
    queryFn: () => apiTemplate.api.accountControllerListSessions(),
    enabled: Boolean(account)
  })

  const revokeSession = useMutation({
    mutationFn: (sessionId: string) => apiTemplate.api.accountControllerRevokeSession(sessionId),
    onSuccess: async () => {
      setSessionToRevoke(null)
      setRevokeError(null)
      await queryClient.invalidateQueries({ queryKey: ['auth', 'sessions', account?.id] })
    },
    onError: () => {
      setRevokeError(t('common:auth.error.revoke', 'ยกเลิก session ไม่สำเร็จ โปรดลองอีกครั้ง'))
    }
  })

  if (!account) return null

  const dateFormatter = new Intl.DateTimeFormat(lang, { dateStyle: 'medium', timeStyle: 'short' })

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logout(logoutScope)
    } catch {
      // AuthProvider still clears local credentials when the server cannot be reached.
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className='space-y-5'>
      <Card className='shadow-xl shadow-foreground/5'>
        <CardHeader>
          <div className='flex min-w-0 items-center gap-3'>
            <Avatar size='lg'>
              <AvatarFallback>{initials(account.name) || 'U'}</AvatarFallback>
              <AvatarBadge aria-label={t('common:auth.account.online', 'กำลังใช้งาน')} />
            </Avatar>
            <div className='min-w-0'>
              <CardTitle className='truncate text-lg'>{account.name}</CardTitle>
              <CardDescription className='truncate'>{account.email}</CardDescription>
            </div>
          </div>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant='outline' size='icon' aria-label={t('common:auth.account.menu', 'เมนูบัญชี')}>
                    <Icon icon={appIcons.menu} className='size-5' aria-hidden='true' />
                  </Button>
                }
              />
              <DropdownMenuContent align='end' className='w-52'>
                <DropdownMenuLabel>{t('common:auth.account.menu', 'เมนูบัญชี')}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => void sessions.refetch()}>
                  <Icon icon={appIcons.refresh} aria-hidden='true' />
                  {t('common:auth.action.refreshSessions', 'โหลด sessions ใหม่')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant='destructive' onClick={() => void handleLogout()}>
                  <Icon icon={appIcons.logout} aria-hidden='true' />
                  {t('common:auth.action.logout', 'ออกจากระบบ')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>

        <CardContent className='space-y-5'>
          <Separator />
          <section aria-labelledby='roles-title'>
            <div className='flex items-center gap-2'>
              <Icon icon={appIcons.security} className='size-4 text-muted-foreground' aria-hidden='true' />
              <h2 id='roles-title' className='text-sm font-medium'>
                {t('common:auth.account.roles', 'บทบาท')}
              </h2>
            </div>
            <div className='mt-3 flex flex-wrap gap-2'>
              {account.roles.length ? (
                account.roles.map(role => <Badge key={role}>{role}</Badge>)
              ) : (
                <span className='text-sm text-muted-foreground'>{t('common:auth.account.none', 'ไม่มีข้อมูล')}</span>
              )}
            </div>
          </section>

          <section aria-labelledby='permissions-title'>
            <div className='flex items-center gap-2'>
              <Icon icon={appIcons.key} className='size-4 text-muted-foreground' aria-hidden='true' />
              <h2 id='permissions-title' className='text-sm font-medium'>
                {t('common:auth.account.permissions', 'สิทธิ์การใช้งาน')}
              </h2>
            </div>
            <div className='mt-3 flex flex-wrap gap-2'>
              {account.permissions.length ? (
                account.permissions.map(permission => (
                  <Badge key={permission} variant='outline' className='font-mono font-normal'>
                    {permission}
                  </Badge>
                ))
              ) : (
                <span className='text-sm text-muted-foreground'>{t('common:auth.account.none', 'ไม่มีข้อมูล')}</span>
              )}
            </div>
          </section>
        </CardContent>

        <CardFooter className='flex-col items-stretch gap-3 sm:flex-row sm:items-center'>
          <Select
            value={logoutScope}
            onValueChange={value => {
              if (value === 'CURRENT_DEVICE' || value === 'ALL_DEVICES') setLogoutScope(value)
            }}>
            <SelectTrigger
              className='min-h-10 w-full sm:w-60'
              aria-label={t('common:auth.logout.scope', 'ขอบเขตการออกจากระบบ')}>
              <SelectValue>
                {logoutScope === 'CURRENT_DEVICE'
                  ? t('common:auth.logout.current', 'เฉพาะอุปกรณ์นี้')
                  : t('common:auth.logout.all', 'ทุกอุปกรณ์')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align='start'>
              <SelectItem value='CURRENT_DEVICE'>{t('common:auth.logout.current', 'เฉพาะอุปกรณ์นี้')}</SelectItem>
              <SelectItem value='ALL_DEVICES'>{t('common:auth.logout.all', 'ทุกอุปกรณ์')}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className='min-h-10 sm:ml-auto'
            variant='outline'
            disabled={isLoggingOut}
            onClick={() => void handleLogout()}>
            {isLoggingOut ? <Spinner aria-hidden='true' /> : <Icon icon={appIcons.logout} aria-hidden='true' />}
            {isLoggingOut
              ? t('common:auth.action.loggingOut', 'กำลังออกจากระบบ')
              : t('common:auth.action.logout', 'ออกจากระบบ')}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('common:auth.session.title', 'Sessions ที่ใช้งานอยู่')}</CardTitle>
          <CardDescription>
            {t('common:auth.session.description', 'ตรวจสอบอุปกรณ์และยกเลิก session ที่คุณไม่รู้จัก')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.isPending ? (
            <div className='flex items-center gap-2 py-6 text-sm text-muted-foreground'>
              <Spinner aria-hidden='true' />
              {t('common:auth.session.loading', 'กำลังโหลด sessions')}
            </div>
          ) : null}

          {sessions.isError ? (
            <Alert variant='destructive'>
              <AlertTitle>{t('common:auth.session.errorTitle', 'โหลด sessions ไม่สำเร็จ')}</AlertTitle>
              <AlertDescription className='flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <span>{t('common:auth.session.errorDescription', 'ตรวจการเชื่อมต่อแล้วลองใหม่อีกครั้ง')}</span>
                <Button variant='outline' size='sm' onClick={() => void sessions.refetch()}>
                  {t('common:auth.action.retry', 'ลองอีกครั้ง')}
                </Button>
              </AlertDescription>
            </Alert>
          ) : null}

          {sessions.data?.length ? (
            <div className='divide-y divide-border'>
              {sessions.data.map(session => (
                <SessionRow
                  key={session.id}
                  session={session}
                  dateFormatter={dateFormatter}
                  onRevoke={setSessionToRevoke}
                />
              ))}
            </div>
          ) : null}

          {sessions.isSuccess && !sessions.data.length ? (
            <p className='py-6 text-sm text-muted-foreground'>
              {t('common:auth.session.empty', 'ไม่พบ session ที่ใช้งานอยู่')}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <AlertDialog
        open={Boolean(sessionToRevoke)}
        onOpenChange={open => {
          if (!open && !revokeSession.isPending) {
            setSessionToRevoke(null)
            setRevokeError(null)
          }
        }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Icon icon={appIcons.security} aria-hidden='true' />
            </AlertDialogMedia>
            <AlertDialogTitle>{t('common:auth.revoke.title', 'ยกเลิก session นี้หรือไม่')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('common:auth.revoke.description', 'อุปกรณ์นั้นจะต้องเข้าสู่ระบบใหม่ การดำเนินการนี้ย้อนกลับไม่ได้')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {revokeError ? <p className='text-sm text-destructive'>{revokeError}</p> : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revokeSession.isPending}>
              {t('common:auth.action.cancel', 'ยกเลิก')}
            </AlertDialogCancel>
            <AlertDialogAction
              variant='destructive'
              disabled={revokeSession.isPending || !sessionToRevoke}
              onClick={() => {
                if (sessionToRevoke) revokeSession.mutate(sessionToRevoke.id)
              }}>
              {revokeSession.isPending ? <Spinner aria-hidden='true' /> : null}
              {t('common:auth.action.confirmRevoke', 'ยืนยันการยกเลิก session')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
