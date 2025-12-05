import { useEffect, useRef } from "react"
import { dev } from "@/lib/dev"

type AsyncFunction<T> = () => Promise<T>

export function useSafeAsync<T = void>(
  asyncFn: AsyncFunction<T>,
  dependencies: React.DependencyList = [],
  options?: {
    onError?: (error: Error) => void
    onSuccess?: (result: T) => void
    enabled?: boolean
  }
) {
  const mountedRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)
  const optionsRef = useRef(options)
  const asyncFnRef = useRef(asyncFn)
  
  optionsRef.current = options
  asyncFnRef.current = asyncFn

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    if (optionsRef.current?.enabled === false) return

    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    const execute = async () => {
      try {
        const result = await asyncFnRef.current()
        
        if (!mountedRef.current || signal.aborted) return
        
        optionsRef.current?.onSuccess?.(result)
      } catch (error) {
        if (!mountedRef.current || signal.aborted) return
        
        const err = error instanceof Error ? error : new Error(String(error))
        
        dev.error(err, {
          source: "useSafeAsync",
          asyncFn: asyncFnRef.current.toString().substring(0, 100),
        })
        
        optionsRef.current?.onError?.(err)
      }
    }

    execute()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, dependencies)
}

