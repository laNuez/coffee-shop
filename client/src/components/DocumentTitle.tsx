import { useEffect } from 'react'
import { useMatches } from 'react-router'
import { APP_NAME } from '../util/constants'

interface RouteHandle {
  title?: string | ((args: unknown) => string | undefined)
}

export const DocumentTitle = ({ title: override }: { title?: string }) => {
  const matches = useMatches()
  const currentMatch = matches[matches.length - 1]
  const handle = currentMatch?.handle as RouteHandle | undefined
  const title = handle?.title

  useEffect(() => {
    if (override) {
      document.title = `${APP_NAME} | ${override}`
      return
    }
    if (typeof title === 'function') {
      const value = title(currentMatch.data)
      if (!value) {
        document.title = APP_NAME
        return
      }
      document.title = `${APP_NAME} | ${value}`
      return
    }

    document.title = title ? `${APP_NAME} | ${title}` : APP_NAME
  }, [currentMatch, title, override])

  return null
}
