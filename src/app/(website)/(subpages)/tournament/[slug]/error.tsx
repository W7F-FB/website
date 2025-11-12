'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Container, Section } from '@/components/website-base/padding-containers'
import { H1, P } from '@/components/website-base/typography'

export default function Error({
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
    <Section padding="lg">
      <Container maxWidth="md" className="text-center">
        <H1 className="mb-4">Something went wrong</H1>
        <P className="text-lg mb-8">
          We're having trouble loading this tournament. This might be due to temporary data availability issues.
        </P>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => reset()}
            size="skew_lg"
          >
            <span>Try again</span>
          </Button>
          <Button
            onClick={() => window.history.back()}
            size="skew_lg"
            variant="outline"
          >
            <span>Go back</span>
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Error details (development only)
            </summary>
            <pre className="mt-4 p-4 bg-muted rounded text-xs overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </Container>
    </Section>
  )
}

