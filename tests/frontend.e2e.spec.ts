import { expect, test } from '@playwright/test'

test('adds the saved locale prefix and renders the localized page', async ({ context, page }) => {
  await context.addCookies([{ name: 'NEXT_LOCALE', value: 'en', domain: 'localhost', path: '/' }])

  await page.goto('/main')

  await expect(page).toHaveURL(/\/en\/main$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('switches language, persists the choice, and keeps the route prefixed', async ({ context, page }) => {
  await page.goto('/th')

  const language = page.getByRole('combobox', { name: 'ภาษา' })
  await language.click()
  await page.getByRole('option', { name: 'อังกฤษ' }).click()

  await expect(page).toHaveURL(/\/en$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('combobox', { name: 'Language' })).toContainText('English')
  await expect
    .poll(async () => (await context.cookies()).find(cookie => cookie.name === 'NEXT_LOCALE')?.value)
    .toBe('en')
})

test('shares the site navigation with auth and applies the Thai font stack', async ({ page }) => {
  await page.route('https://api.iconify.design/**', route => route.abort())
  await page.goto('/th')

  await expect(page.locator('body')).toHaveCSS('font-family', /IBM Plex Sans Thai/)
  await expect(page.getByRole('button', { name: 'สลับธีมสี' }).locator('svg').first()).toBeVisible()
  const signIn = page.getByRole('link', { name: 'เข้าสู่ระบบ' })
  await expect(signIn).toHaveAttribute('href', '/th/auth')
  await signIn.click()

  await expect(page).toHaveURL(/\/th\/auth$/)
  await expect(page.getByRole('banner').getByRole('link', { name: 'Next foundation' })).toHaveAttribute('href', '/th')
  await expect(page.getByRole('heading', { name: 'Authentication ที่พร้อมต่อยอด' })).toBeVisible()
  await expect(page.getByRole('banner').getByRole('link', { name: 'เข้าสู่ระบบ' })).toHaveCount(0)
})

test('toggles and persists the color theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/en')

  const themeToggle = page.getByRole('button', { name: 'Toggle color theme' })
  await expect(themeToggle).toBeEnabled()
  await expect(page.locator('html')).not.toHaveClass(/dark/)

  await themeToggle.click()

  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
})
