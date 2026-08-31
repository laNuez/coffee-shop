import { useEffect, useRef } from 'react'

export const useKeyDebounceCallback = <Args extends unknown[]>(
  callback: (key: string, ...args: Args) => void,
  timeout: number
) => {
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    return () => {
      cancelAll()
    }
  }, [])

  const debounce = (key: string, ...args: Args) => {
    const existingTimer = timers.current.get(key)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    const newTimer = setTimeout(() => {
      callback(key, ...args)
      timers.current.delete(key)
    }, timeout)

    timers.current.set(key, newTimer)
  }

  const cancel = (key: string) => {
    const timer = timers.current.get(key)
    if (!timer) return
    clearTimeout(timer)
    timers.current.delete(key)
  }

  function cancelAll() {
    timers.current.forEach((timer) => clearTimeout(timer))
    timers.current.clear()
  }

  return { debounce, cancel, cancelAll, pendingCount: timers.current.size }
}
