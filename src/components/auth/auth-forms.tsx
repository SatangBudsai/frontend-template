'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLang } from '@/hooks/use-lang'
import { useAuth } from '@/providers/auth-provider'

type LoginFields = {
  email: string
  password: string
}

type RegisterFields = LoginFields & {
  name: string
  confirmPassword: string
}

function getApiError(error: unknown, fallback: string) {
  if (!error || typeof error !== 'object' || !('response' in error)) return fallback

  const response = (error as { response?: { data?: unknown } }).response
  const data = response?.data
  if (!data || typeof data !== 'object') return fallback

  const problem = data as { detail?: unknown; title?: unknown }
  if (typeof problem.detail === 'string' && problem.detail.trim()) return problem.detail
  if (typeof problem.title === 'string' && problem.title.trim()) return problem.title
  return fallback
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className='text-xs text-destructive'>
      {message}
    </p>
  )
}

function LoginForm() {
  const { t } = useLang()
  const { login } = useAuth()
  const [apiError, setApiError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFields>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { email: '', password: '' }
  })

  return (
    <form
      className='space-y-5'
      noValidate
      onSubmit={handleSubmit(async input => {
        setApiError(null)
        try {
          await login(input)
        } catch (error) {
          setApiError(getApiError(error, t('common:auth.error.login', 'เข้าสู่ระบบไม่สำเร็จ โปรดลองอีกครั้ง')))
        }
      })}>
      {apiError ? (
        <Alert variant='destructive'>
          <AlertTitle>{t('common:auth.error.title', 'ดำเนินการไม่สำเร็จ')}</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      ) : null}

      <div className='space-y-2'>
        <Label htmlFor='login-email'>{t('common:auth.field.email', 'อีเมล')}</Label>
        <Input
          id='login-email'
          type='email'
          inputMode='email'
          autoComplete='email'
          placeholder='name@example.com'
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          {...register('email', {
            required: t('common:auth.validation.emailRequired', 'กรุณากรอกอีเมล'),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t('common:auth.validation.emailInvalid', 'รูปแบบอีเมลไม่ถูกต้อง')
            }
          })}
        />
        <FieldError id='login-email-error' message={errors.email?.message} />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='login-password'>{t('common:auth.field.password', 'รหัสผ่าน')}</Label>
        <Input
          id='login-password'
          type='password'
          autoComplete='current-password'
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'login-password-error' : undefined}
          {...register('password', { required: t('common:auth.validation.passwordRequired', 'กรุณากรอกรหัสผ่าน') })}
        />
        <FieldError id='login-password-error' message={errors.password?.message} />
      </div>

      <Button className='min-h-11 w-full' type='submit' disabled={isSubmitting}>
        {isSubmitting ? <Spinner aria-hidden='true' /> : null}
        {isSubmitting
          ? t('common:auth.action.signingIn', 'กำลังเข้าสู่ระบบ')
          : t('common:auth.action.signIn', 'เข้าสู่ระบบ')}
      </Button>
    </form>
  )
}

function RegisterForm() {
  const { t } = useLang()
  const { register: registerAccount } = useAuth()
  const [apiError, setApiError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFields>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
  })

  return (
    <form
      className='space-y-5'
      noValidate
      onSubmit={handleSubmit(async input => {
        setApiError(null)
        try {
          await registerAccount({ name: input.name, email: input.email, password: input.password })
        } catch (error) {
          setApiError(getApiError(error, t('common:auth.error.register', 'สมัครสมาชิกไม่สำเร็จ โปรดลองอีกครั้ง')))
        }
      })}>
      {apiError ? (
        <Alert variant='destructive'>
          <AlertTitle>{t('common:auth.error.title', 'ดำเนินการไม่สำเร็จ')}</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      ) : null}

      <div className='space-y-2'>
        <Label htmlFor='register-name'>{t('common:auth.field.name', 'ชื่อที่แสดง')}</Label>
        <Input
          id='register-name'
          autoComplete='name'
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'register-name-error' : undefined}
          {...register('name', { required: t('common:auth.validation.nameRequired', 'กรุณากรอกชื่อ') })}
        />
        <FieldError id='register-name-error' message={errors.name?.message} />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='register-email'>{t('common:auth.field.email', 'อีเมล')}</Label>
        <Input
          id='register-email'
          type='email'
          inputMode='email'
          autoComplete='email'
          placeholder='name@example.com'
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'register-email-error' : undefined}
          {...register('email', {
            required: t('common:auth.validation.emailRequired', 'กรุณากรอกอีเมล'),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t('common:auth.validation.emailInvalid', 'รูปแบบอีเมลไม่ถูกต้อง')
            }
          })}
        />
        <FieldError id='register-email-error' message={errors.email?.message} />
      </div>

      <div className='grid gap-5 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='register-password'>{t('common:auth.field.password', 'รหัสผ่าน')}</Label>
          <Input
            id='register-password'
            type='password'
            autoComplete='new-password'
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'register-password-error' : undefined}
            {...register('password', {
              required: t('common:auth.validation.passwordRequired', 'กรุณากรอกรหัสผ่าน'),
              minLength: {
                value: 12,
                message: t('common:auth.validation.passwordLength', 'รหัสผ่านต้องมีอย่างน้อย 12 ตัวอักษร')
              }
            })}
          />
          <FieldError id='register-password-error' message={errors.password?.message} />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='register-confirm-password'>{t('common:auth.field.confirmPassword', 'ยืนยันรหัสผ่าน')}</Label>
          <Input
            id='register-confirm-password'
            type='password'
            autoComplete='new-password'
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? 'register-confirm-password-error' : undefined}
            {...register('confirmPassword', {
              required: t('common:auth.validation.confirmRequired', 'กรุณายืนยันรหัสผ่าน'),
              validate: value =>
                value === getValues('password') || t('common:auth.validation.passwordMismatch', 'รหัสผ่านไม่ตรงกัน')
            })}
          />
          <FieldError id='register-confirm-password-error' message={errors.confirmPassword?.message} />
        </div>
      </div>

      <Button className='min-h-11 w-full' type='submit' disabled={isSubmitting}>
        {isSubmitting ? <Spinner aria-hidden='true' /> : null}
        {isSubmitting
          ? t('common:auth.action.creatingAccount', 'กำลังสร้างบัญชี')
          : t('common:auth.action.createAccount', 'สร้างบัญชี')}
      </Button>
    </form>
  )
}

export function AuthForms() {
  const { t } = useLang()

  return (
    <Card className='w-full shadow-xl shadow-foreground/5'>
      <CardHeader>
        <CardTitle className='text-xl'>{t('common:auth.card.title', 'ยินดีต้อนรับ')}</CardTitle>
        <CardDescription>
          {t('common:auth.card.description', 'เข้าสู่ระบบด้วยบัญชีเดิม หรือสร้างบัญชีใหม่เพื่อเริ่มใช้งาน')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='login'>
          <TabsList className='mb-6 grid h-10 w-full grid-cols-2'>
            <TabsTrigger value='login'>{t('common:auth.tab.signIn', 'เข้าสู่ระบบ')}</TabsTrigger>
            <TabsTrigger value='register'>{t('common:auth.tab.register', 'สมัครสมาชิก')}</TabsTrigger>
          </TabsList>
          <TabsContent value='login'>
            <LoginForm />
          </TabsContent>
          <TabsContent value='register'>
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
