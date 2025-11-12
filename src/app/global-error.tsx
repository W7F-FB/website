'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold mb-4">Application Error</h1>
            <p className="text-lg mb-8 text-muted-foreground">
              Something went wrong. Please try refreshing the page.
            </p>
            <Button onClick={() => reset()} size="lg">
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}

