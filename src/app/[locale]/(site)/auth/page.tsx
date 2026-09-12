import { AuthExperience } from '@/components/auth/auth-experience'
import { Icon } from '@/components/ui/icon'
import { appIcons } from '@/config/icons'
import { getTranslate } from '@/tolgee/server'

export default async function AuthPage() {
  const t = await getTranslate()

  return (
    <main className='grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:py-16'>
      <div className='max-w-xl'>
        <div className='mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur'>
          <span className='size-2 rounded-full bg-emerald-500' aria-hidden='true' />
          {t('common:auth.eyebrow', 'JWE · refresh rotation · role-aware')}
        </div>
        <h1 className='font-heading text-4xl leading-[1.05] font-semibold tracking-[-0.045em] text-balance sm:text-5xl lg:text-6xl'>
          {t('common:auth.hero.title', 'Authentication ที่พร้อมต่อยอด')}
        </h1>
        <p className='mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8'>
          {t(
            'common:auth.hero.description',
            'ตัวอย่าง flow ครบตั้งแต่สมัครสมาชิก เข้าสู่ระบบ ต่ออายุ session ไปจนถึงออกจากระบบทุกอุปกรณ์ โดยไม่เก็บ token ใน localStorage'
          )}
        </p>

        <ul className='mt-8 hidden gap-3 text-sm sm:grid sm:grid-cols-2 lg:grid-cols-1'>
          {[
            t('common:auth.feature.memory', 'JWE access token อยู่ใน memory เท่านั้น'),
            t('common:auth.feature.cookie', 'Refresh token ปลอดภัยด้วย HttpOnly cookie'),
            t('common:auth.feature.roles', 'รองรับ roles และ permissions จาก API'),
            t('common:auth.feature.sessions', 'ตรวจและยกเลิก sessions รายอุปกรณ์')
          ].map(feature => (
            <li key={feature} className='flex items-start gap-3'>
              <Icon
                icon={appIcons.checkCircle}
                className='mt-0.5 size-5 shrink-0 text-emerald-600'
                aria-hidden='true'
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <AuthExperience />
    </main>
  )
}
