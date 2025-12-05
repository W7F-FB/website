"use client"

import { useEffect } from "react"
import { dev } from "@/lib/dev"

interface ErrorDetails {
  message: string
  stack?: string
  componentStack?: string
  filename?: string
  lineno?: number
  colno?: number
  error?: Error
  url?: string
  userAgent?: string
  timestamp: string
  type: "error" | "unhandledrejection"
  reason?: unknown
}

function formatErrorDetails(details: ErrorDetails): string {
  const parts: string[] = []
  
  parts.push(`[${details.type.toUpperCase()}] ${details.message}`)
  parts.push(`Timestamp: ${details.timestamp}`)
  
  if (details.url) {
    parts.push(`URL: ${details.url}`)
  }
  
  if (details.filename) {
    parts.push(`File: ${details.filename}`)
    if (details.lineno !== undefined) {
      parts.push(`Line: ${details.lineno}`)
    }
    if (details.colno !== undefined) {
      parts.push(`Column: ${details.colno}`)
    }
  }
  
  if (details.userAgent) {
    parts.push(`User Agent: ${details.userAgent}`)
  }
  
  if (details.stack) {
    parts.push(`\nStack Trace:\n${details.stack}`)
  }
  
  if (details.componentStack) {
    parts.push(`\nComponent Stack:\n${details.componentStack}`)
  }
  
  if (details.error && details.error.stack) {
    parts.push(`\nError Stack:\n${details.error.stack}`)
  }
  
  if (details.reason !== undefined) {
    parts.push(`\nRejection Reason: ${JSON.stringify(details.reason, null, 2)}`)
    if (details.reason instanceof Error && details.reason.stack) {
      parts.push(`\nRejection Stack:\n${details.reason.stack}`)
    }
  }
  
  return parts.join("\n")
}

function logErrorToVercel(details: ErrorDetails) {
  const formattedError = formatErrorDetails(details)
  
  console.error("=".repeat(80))
  console.error("CLIENT-SIDE ERROR DETECTED")
  console.error("=".repeat(80))
  console.error(formattedError)
  console.error("=".repeat(80))
  
  if (details.error) {
    console.error("Error Object:", details.error)
  }
  
  if (details.reason) {
    console.error("Rejection Reason Object:", details.reason)
  }
  
  try {
    const errorData = {
      message: details.message,
      stack: details.stack || details.error?.stack,
      componentStack: details.componentStack,
      filename: details.filename,
      lineno: details.lineno,
      colno: details.colno,
      url: details.url,
      userAgent: details.userAgent,
      timestamp: details.timestamp,
      type: details.type,
      reason: details.reason instanceof Error 
        ? {
            message: details.reason.message,
            stack: details.reason.stack,
            name: details.reason.name,
          }
        : details.reason,
    }
    
    console.error("Structured Error Data:", JSON.stringify(errorData, null, 2))
  } catch (jsonError) {
    console.error("Failed to stringify error data:", jsonError)
  }
}

export function ErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const details: ErrorDetails = {
        message: event.message || "Unknown error",
        stack: event.error?.stack,
        componentStack: undefined,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        url: typeof window !== "undefined" ? window.location.href : undefined,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        timestamp: new Date().toISOString(),
        type: "error",
      }
      
      logErrorToVercel(details)
      dev.error(event.error || new Error(event.message), {
        source: "global-error-handler",
        ...details,
      })
    }
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      const message = reason instanceof Error 
        ? reason.message 
        : typeof reason === "string" 
        ? reason 
        : JSON.stringify(reason)
      
      const details: ErrorDetails = {
        message: `Unhandled Promise Rejection: ${message}`,
        stack: reason instanceof Error ? reason.stack : undefined,
        componentStack: undefined,
        error: reason instanceof Error ? reason : undefined,
        url: typeof window !== "undefined" ? window.location.href : undefined,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        timestamp: new Date().toISOString(),
        type: "unhandledrejection",
        reason,
      }
      
      logErrorToVercel(details)
      const error = reason instanceof Error 
        ? reason 
        : new Error(`Unhandled Promise Rejection: ${message}`)
      dev.error(error, {
        source: "global-unhandled-rejection",
        ...details,
      })
    }
    
    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    
    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])
  
  return null
}

