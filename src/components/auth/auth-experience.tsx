'use client'

import { AuthForms } from '@/components/auth/auth-forms'
import { AccountDashboard } from '@/components/auth/account-dashboard'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { appIcons } from '@/config/icons'
import { useLang } from '@/hooks/use-lang'
import { useAuth } from '@/providers/auth-provider'

function AuthLoading() {
  return (
    <Card className='w-full' aria-busy='true'>
      <CardHeader className='gap-3'>
        <Skeleton className='h-5 w-28' />
        <Skeleton className='h-4 w-3/4' />
      </CardHeader>
      <CardContent className='space-y-5'>
        <Skeleton className='h-9 w-full' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-10 w-full' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-10 w-full' />
        </div>
        <Skeleton className='h-11 w-full' />
      </CardContent>
    </Card>
  )
}

export function AuthExperience() {
  const { status } = useAuth()
  const { t } = useLang()

  if (status === 'loading') return <AuthLoading />
  if (status === 'authenticated') return <AccountDashboard />

  return (
    <div className='space-y-4'>
      {status === 'unavailable' ? (
        <Alert>
          <Icon icon={appIcons.refresh} aria-hidden='true' />
          <AlertTitle>{t('common:auth.unavailable.title', 'ยังเชื่อมต่อบริการบัญชีไม่ได้')}</AlertTitle>
          <AlertDescription>
            {t(
              'common:auth.unavailable.description',
              'ตรวจว่า api-template ทำงานอยู่และตั้งค่า SERVICE_URL แล้ว คุณยังลองส่งฟอร์มอีกครั้งได้เมื่อ API พร้อม'
            )}
          </AlertDescription>
        </Alert>
      ) : null}
      <AuthForms />
    </div>
  )
}
