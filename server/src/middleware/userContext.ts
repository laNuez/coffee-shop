import { ENV } from '@server/env'
import type { Variables } from '@server/types'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { verify } from 'hono/jwt'
import { JwtTokenExpired } from 'hono/utils/jwt/types'
export const userContext = createMiddleware(async (c, next) => {
  const token = getCookie(c, 'access_token')

  if (!token) {
    c.set('currentUser', null)
    await next()
    return
  }

  try {
    const user = await verify(token, ENV.JWT_SECRET)
    c.set('currentUser', user)
    await next()
    return
  } catch (error) {
    if (!(error instanceof JwtTokenExpired)) {
      console.log(error)
    }
    c.set('currentUser', null)
    await next()
    return
  }
})

export const requireAuth = createMiddleware<Variables>(async (c, next) => {
  const user = c.get('currentUser')
  if (!user) {
    const response = new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
    throw new HTTPException(401, { res: response })
  }
  await next()
})
