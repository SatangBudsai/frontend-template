import { AuthNavigation } from '@/components/layout/auth-navigation'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { getTranslate } from '@/tolgee/server'

export async function SiteHeader() {
  const t = await getTranslate()

  return (
    <header className='flex items-center justify-between gap-3 border-b border-border py-6 sm:gap-4'>
      <Link
        href='/'
        className='flex min-w-0 items-center gap-3'
        aria-label={t('common:home.brand.name', 'Next foundation')}>
        <span
          className='grid size-9 shrink-0 place-items-center rounded-lg bg-foreground text-background'
          aria-hidden='true'>
          N
        </span>
        <span className='hidden min-w-0 sm:block'>
          <span className='block truncate text-sm font-semibold tracking-tight'>
            {t('common:home.brand.name', 'Next foundation')}
          </span>
          <span className='block truncate font-mono text-xs text-muted-foreground'>
            {t('common:home.brand.version', 'template / v0.2')}
          </span>
        </span>
      </Link>

      <nav className='hidden items-center gap-1 lg:flex' aria-label={t('common:navigation.primary', 'เมนูหลัก')}>
        <a
          className={cn(buttonVariants({ variant: 'ghost' }), 'px-3')}
          href='https://ui.shadcn.com/docs/components'
          target='_blank'
          rel='noreferrer'>
          {t('common:home.action.components', 'ดู components')}
        </a>
        <a
          className={cn(buttonVariants({ variant: 'ghost' }), 'px-3')}
          href='https://nextjs.org/docs/app'
          target='_blank'
          rel='noreferrer'>
          {t('common:home.action.nextDocs', 'อ่านคู่มือ Next.js')}
        </a>
      </nav>

      <div className='flex shrink-0 items-center gap-2'>
        <span className='hidden items-center gap-2 text-xs text-muted-foreground 2xl:flex'>
          <span className='size-2 rounded-full bg-emerald-500' aria-hidden='true' />
          {t('common:home.status', 'พร้อมต่อยอด')}
        </span>
        <LanguageSwitcher
          label={t('common:language.label', 'ภาษา')}
          thaiLabel={t('common:language.th', 'ไทย')}
          englishLabel={t('common:language.en', 'อังกฤษ')}
        />
        <ThemeToggle label={t('common:theme.toggle', 'สลับธีมสี')} />
        <AuthNavigation
          signInLabel={t('common:home.action.login', 'เข้าสู่ระบบ')}
          accountMenuLabel={t('common:auth.account.menu', 'เมนูบัญชี')}
          manageAccountLabel={t('common:auth.account.manage', 'จัดการบัญชีและ sessions')}
          logoutLabel={t('common:auth.action.logout', 'ออกจากระบบ')}
        />
      </div>
    </header>
  )
}
