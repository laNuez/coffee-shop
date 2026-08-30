import { hcWithType } from 'server/dist/client'
import { SERVER_URL } from '../util/constants'
import { NotFoundError, UnauthorizedError } from '../util/util'

const fetcher = async (request: Request | string | URL, init?: RequestInit) => {
  const response = await fetch(request, init)

  const ME_ENDPOINT = new URL(response.url).pathname === '/api/me'

  if (response.status === 401 && !ME_ENDPOINT) {
    throw new UnauthorizedError()
  }

  if (response.status === 404) {
    throw new NotFoundError()
  }

  return response
}

export const client = hcWithType(SERVER_URL, {
  init: {
    credentials: 'include'
  },
  fetch: fetcher
})
