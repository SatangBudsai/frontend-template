import { buttonVariants } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { appIcons } from '@/config/icons'
import { cn } from '@/lib/utils'
import { getTranslate } from '@/tolgee/server'

export default async function HomePage() {
  const t = await getTranslate()
  const foundation = [
    t('common:home.foundation.next', 'Next.js App Router'),
    t('common:home.foundation.react', 'React Server Components'),
    t('common:home.foundation.tailwind', 'Tailwind CSS v4'),
    t('common:home.foundation.shadcn', 'shadcn/ui ที่เป็น source ของโปรเจกต์'),
    t('common:home.foundation.api', 'Type ที่ generate จาก OpenAPI'),
    t('common:home.foundation.query', 'TanStack Query สำหรับ server state'),
    t('common:home.foundation.redux', 'Redux Toolkit สำหรับ global client state'),
    t('common:home.foundation.icons', 'ไอคอนจาก Iconify'),
    t('common:home.foundation.i18n', 'ภาษาไทย/อังกฤษด้วย Tolgee'),
    t('common:home.foundation.theme', 'ธีมตามค่าของระบบ')
  ]

  return (
    <main className='flex flex-1 flex-col'>
      <section className='grid flex-1 items-center gap-14 py-16 lg:grid-cols-[1.25fr_0.75fr] lg:gap-24 lg:py-20'>
        <div>
          <p className='mb-6 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase'>
            {t('common:home.eyebrow', 'เริ่มสะอาด · มีค่าเริ่มต้นที่พอดี')}
          </p>
          <h1 className='max-w-3xl text-5xl leading-[0.96] font-semibold tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl'>
            {t('common:home.hero.lineOne', 'สร้างผลิตภัณฑ์')}
            <span className='block text-muted-foreground'>
              {t('common:home.hero.lineTwo', 'ไม่ต้องเสียเวลากับ setup')}
            </span>
          </h1>
          <p className='mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8'>
            {t(
              'common:home.description',
              'โครง Next.js ที่ตั้งใจให้เล็ก แต่พร้อมด้วย type จาก API, route สองภาษา, UI ที่เราเป็นเจ้าของ และ quality checks ครบ'
            )}
          </p>

          <div className='mt-9 flex flex-col gap-3 sm:flex-row'>
            <a
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'min-h-11 px-5')}
              href='https://ui.shadcn.com/docs/components'
              target='_blank'
              rel='noreferrer'>
              {t('common:home.action.components', 'ดู components')}
              <Icon icon={appIcons.arrowOutward} data-icon='inline-end' aria-hidden='true' />
            </a>
            <a
              className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), 'min-h-11 px-5')}
              href='https://nextjs.org/docs/app'
              target='_blank'
              rel='noreferrer'>
              {t('common:home.action.nextDocs', 'อ่านคู่มือ Next.js')}
            </a>
          </div>
        </div>

        <aside className='border-y border-border bg-background/80 py-7 backdrop-blur-sm lg:border lg:p-8'>
          <div className='flex items-center justify-between gap-4'>
            <h2 className='text-sm font-semibold'>{t('common:home.foundation.title', 'สิ่งที่เตรียมไว้')}</h2>
            <span className='shrink-0 text-[0.6875rem] text-muted-foreground'>
              {t('common:home.foundation.count', '{count, number} โมดูล', { count: foundation.length })}
            </span>
          </div>
          <ul className='mt-6 space-y-1' aria-label={t('common:home.foundation.title', 'สิ่งที่เตรียมไว้')}>
            {foundation.map((item, index) => (
              <li key={item} className='flex items-center gap-3 border-t border-border py-3 first:border-t-0'>
                <span className='font-mono text-xs text-muted-foreground'>{String(index + 1).padStart(2, '0')}</span>
                <span className='flex-1 text-sm'>{item}</span>
                <Icon icon={appIcons.check} className='size-4 shrink-0 text-emerald-600' aria-hidden='true' />
              </li>
            ))}
          </ul>

          <div className='mt-7 rounded-lg bg-foreground p-4 text-background'>
            <div className='flex items-center gap-2 text-[0.6875rem] tracking-wider uppercase opacity-60'>
              <Icon icon={appIcons.terminal} className='size-3.5' aria-hidden='true' />
              {t('common:home.firstMove', 'คำสั่งแรก')}
            </div>
            <code className='mt-3 block overflow-x-auto font-mono text-xs leading-6 whitespace-nowrap'>pnpm dev</code>
          </div>
        </aside>
      </section>

      <footer className='flex flex-col gap-2 border-t border-border py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between'>
        <p>{t('common:home.footer.ownership', 'เป็นเจ้าของ component source และเพิ่ม dependency เท่าที่จำเป็น')}</p>
        <p className='font-mono'>pnpm · TypeScript · OpenAPI · Tolgee</p>
      </footer>
    </main>
  )
}
