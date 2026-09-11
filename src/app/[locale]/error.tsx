'use client'

import { StatusPage } from '@/components/status-page'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { appIcons } from '@/config/icons'
import { useLang } from '@/hooks/use-lang'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  const { t } = useLang()

  return (
    <StatusPage
      eyebrow={t('common:error.application.eyebrow', 'แอปพลิเคชันขัดข้อง')}
      title={t('common:error.application.title', 'เกิดข้อผิดพลาดบางอย่าง')}
      description={t(
        'common:error.application.description',
        'หน้าเว็บโหลดไม่สำเร็จ ลองใหม่อีกครั้ง โดยรายละเอียดภายในจะอยู่ใน server logs'
      )}
      action={
        <Button size='lg' onClick={reset}>
          <Icon icon={appIcons.refresh} data-icon='inline-start' aria-hidden='true' />
          {t('common:error.application.retry', 'ลองอีกครั้ง')}
        </Button>
      }
    />
  )
}
