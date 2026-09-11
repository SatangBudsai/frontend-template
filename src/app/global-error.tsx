'use client'

import { RotateCcw } from 'lucide-react'

import { StatusPage } from '@/components/status-page'
import { Button } from '@/components/ui/button'

type GlobalErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalErrorPage({ reset }: GlobalErrorPageProps) {
  return (
    <html lang='en'>
      <body>
        <StatusPage
          eyebrow='Critical error'
          title='The application needs a fresh start.'
          description='A root-level error interrupted the page. Retry once, then check the server logs if the problem continues.'
          action={
            <Button size='lg' onClick={reset}>
              <RotateCcw data-icon='inline-start' aria-hidden='true' />
              Reload application
            </Button>
          }
        />
      </body>
    </html>
  )
}
