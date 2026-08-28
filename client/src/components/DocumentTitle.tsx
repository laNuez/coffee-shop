import { useEffect } from 'react'
import { useMatches } from 'react-router'
import { Product } from 'shared'

interface RouteHandle {
  title?: string
}

export const DocumentTitle = () => {
  const matches = useMatches()
  const currentMatch = matches[matches.length - 1]
  const handle = currentMatch?.handle as RouteHandle | undefined
  const title = handle?.title

  useEffect(() => {
    if (currentMatch.pathname.startsWith('/product/')) {
      document.title = title
        ? `Kofi | ${(currentMatch.data as Product).name}`
        : 'Kofi'
      return
    }

    document.title = title ? `Kofi | ${title}` : 'Kofi'
  }, [currentMatch])

  return null
}
