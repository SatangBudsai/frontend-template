import type { ReactNode } from 'react'

type StatusPageProps = {
  action: ReactNode
  description: string
  eyebrow: string
  title: string
}

export function StatusPage({ action, description, eyebrow, title }: StatusPageProps) {
  return (
    <main className='relative grid min-h-svh place-items-center overflow-hidden bg-background px-6 py-16 text-foreground'>
      <div className='template-grid pointer-events-none absolute inset-0 opacity-70' aria-hidden='true' />
      <section className='relative w-full max-w-xl border-y border-border bg-background/90 py-10 text-center backdrop-blur-sm sm:border sm:p-12'>
        <p className='font-mono text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase'>{eyebrow}</p>
        <h1 className='mt-4 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl'>{title}</h1>
        <p className='mx-auto mt-5 max-w-md leading-7 text-muted-foreground'>{description}</p>
        <div className='mt-8 flex justify-center'>{action}</div>
      </section>
    </main>
  )
}
