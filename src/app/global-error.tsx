'use client'

import styles from './global-error.module.css'

type GlobalErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalErrorPage({ reset }: GlobalErrorPageProps) {
  return (
    <html lang='en'>
      <body className={styles.body}>
        <title>Application error</title>
        <main className={styles.main}>
          <section className={styles.panel} role='alert'>
            <p className={styles.eyebrow}>
              Application error / <span lang='th'>แอปพลิเคชันขัดข้อง</span>
            </p>
            <h1 className={styles.title}>The application needs a fresh start.</h1>
            <p className={styles.description}>
              A root-level error interrupted the page.{' '}
              <span lang='th'>เกิดข้อผิดพลาดระดับระบบ กรุณาลองโหลดแอปพลิเคชันอีกครั้ง</span>
            </p>
            <button className={styles.button} type='button' onClick={reset}>
              Reload application / <span lang='th'>โหลดใหม่</span>
            </button>
          </section>
        </main>
      </body>
    </html>
  )
}
