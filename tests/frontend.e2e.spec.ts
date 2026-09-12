import { expect, test } from '@playwright/test'

test('adds the saved locale prefix and renders the localized page', async ({ context, page }) => {
  await context.addCookies([{ name: 'NEXT_LOCALE', value: 'en', domain: 'localhost', path: '/' }])

  await page.goto('/main')

  await expect(page).toHaveURL(/\/en\/main$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('switches language, persists the choice, and keeps the route prefixed', async ({ context, page }) => {
  await page.goto('/th')

  const language = page.getByRole('combobox')
  await language.selectOption('en')

  await expect(page).toHaveURL(/\/en$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(language).toHaveValue('en')
  await expect
    .poll(async () => (await context.cookies()).find(cookie => cookie.name === 'NEXT_LOCALE')?.value)
    .toBe('en')
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
