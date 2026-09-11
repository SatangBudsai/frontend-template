import { StatusPage } from '@/components/status-page'
import { buttonVariants } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { appIcons } from '@/config/icons'
import { Link } from '@/i18n/navigation'
import { getTranslate } from '@/tolgee/server'

export default async function NotFoundPage() {
  const t = await getTranslate()

  return (
    <StatusPage
      eyebrow={t('common:error.notFound.eyebrow', '404 / ไม่พบหน้า')}
      title={t('common:error.notFound.title', 'ไม่มีหน้าที่คุณกำลังค้นหา')}
      description={t('common:error.notFound.description', 'ที่อยู่อาจไม่ถูกต้อง หรือหน้านี้อาจถูกย้ายแล้ว')}
      action={
        <Link className={buttonVariants({ size: 'lg' })} href='/'>
          <Icon icon={appIcons.arrowBack} data-icon='inline-start' aria-hidden='true' />
          {t('common:error.notFound.home', 'กลับหน้าหลัก')}
        </Link>
      }
    />
  )
}
