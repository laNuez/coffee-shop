import { useEffect, useRef, useState } from 'react'

export const useKeyDebounceCallback = <Args extends unknown[]>(
  callback: (key: string, ...args: Args) => void,
  timeout: number
) => {
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const [hasPending, setHasPending] = useState(false)

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer))
      timers.current.clear()
    }
  }, [])

  const debounce = (key: string, ...args: Args) => {
    const existingTimer = timers.current.get(key)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    const newTimer = setTimeout(() => {
      timers.current.delete(key)
      setHasPending(timers.current.size > 0)
      callback(key, ...args)
    }, timeout)

    timers.current.set(key, newTimer)
    setHasPending(true)
  }

  const cancel = (key: string) => {
    const timer = timers.current.get(key)
    if (!timer) return
    clearTimeout(timer)
    timers.current.delete(key)
    setHasPending(timers.current.size > 0)
  }

  const cancelAll = () => {
    timers.current.forEach((timer) => clearTimeout(timer))
    timers.current.clear()
    setHasPending(false)
  }

  return { debounce, cancel, cancelAll, hasPending }
}
