"use client"

import { useEffect } from "react"
import { dev } from "@/lib/dev"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    const errorDetails = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      digest: error.digest,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      timestamp: new Date().toISOString(),
    }
    
    console.error("=".repeat(80))
    console.error("NEXT.JS ERROR BOUNDARY TRIGGERED")
    console.error("=".repeat(80))
    console.error("Error Message:", error.message)
    console.error("Error Name:", error.name)
    console.error("Error Digest:", error.digest)
    console.error("Timestamp:", errorDetails.timestamp)
    console.error("URL:", errorDetails.url)
    console.error("User Agent:", errorDetails.userAgent)
    
    if (error.stack) {
      console.error("\nFull Stack Trace:")
      console.error(error.stack)
    }
    
    console.error("\nStructured Error Data:")
    console.error(JSON.stringify(errorDetails, null, 2))
    console.error("=".repeat(80))
    
    dev.error(error, { source: "error-boundary", ...errorDetails })
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold">Something went wrong!</h1>
        <p className="mb-4 text-muted-foreground">
          An error occurred while rendering this page. The error has been logged.
        </p>
        {process.env.NODE_ENV === "development" && (
          <details className="mb-4 rounded-md bg-muted p-4 text-left">
            <summary className="cursor-pointer font-semibold">Error Details</summary>
            <pre className="mt-2 overflow-auto text-xs">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        <button
          onClick={reset}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

