import { dev } from "./dev"

export function safeAccess<T, R>(
  obj: T | null | undefined,
  accessor: (obj: T) => R,
  fallback?: R,
  context?: string
): R | undefined {
  if (obj === null || obj === undefined) {
    return fallback
  }

  try {
    return accessor(obj)
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    dev.error(err, {
      source: "safeAccess",
      context: context || "unknown",
      objectType: typeof obj,
    })
    return fallback
  }
}

export function safeGet<T, K extends keyof T>(
  obj: T | null | undefined,
  key: K,
  fallback?: T[K]
): T[K] | undefined {
  if (obj === null || obj === undefined) {
    return fallback
  }

  try {
    return obj[key]
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    dev.error(err, {
      source: "safeGet",
      key: String(key),
    })
    return fallback
  }
}

export function safeCall<T extends (...args: unknown[]) => unknown>(
  fn: T | null | undefined,
  ...args: Parameters<T>
): ReturnType<T> | undefined {
  if (!fn || typeof fn !== "function") {
    return undefined
  }

  try {
    return fn(...args) as ReturnType<T>
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    dev.error(err, {
      source: "safeCall",
      functionName: fn.name || "anonymous",
    })
    return undefined
  }
}

export async function safeAsync<T>(
  promise: Promise<T>,
  fallback?: T,
  context?: string
): Promise<T | undefined> {
  try {
    return await promise
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    dev.error(err, {
      source: "safeAsync",
      context: context || "unknown",
    })
    return fallback
  }
}

