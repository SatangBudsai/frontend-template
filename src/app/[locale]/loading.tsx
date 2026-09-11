export default function LoadingPage() {
  return (
    <main className='grid min-h-svh place-items-center bg-background px-6 text-foreground' aria-busy='true'>
      <div className='w-full max-w-md space-y-4' role='status'>
        <p className='sr-only'>Loading page</p>
        <div className='h-3 w-24 animate-pulse rounded-full bg-muted motion-reduce:animate-none' aria-hidden='true' />
        <div className='h-10 w-full animate-pulse rounded-lg bg-muted motion-reduce:animate-none' aria-hidden='true' />
        <div className='h-4 w-4/5 animate-pulse rounded-full bg-muted motion-reduce:animate-none' aria-hidden='true' />
      </div>
    </main>
  )
}
