import { useEffect, useRef } from 'react'

export const useDebounceCallback = <Args extends unknown[]>(
  callback: (...args: Args) => void,
  timeout: number
) => {
  const timeoutId = useRef<ReturnType<typeof setTimeout>>(null)

  const remTimeout = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
      timeoutId.current = null
    }
  }

  useEffect(() => {
    return () => {
      remTimeout()
    }
  }, [])

  return {
    debounced: (...args: Args) => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }

      timeoutId.current = setTimeout(() => {
        callback(...args)
      }, timeout)
    },
    cancel: function () {
      remTimeout()
    }
  }
}
