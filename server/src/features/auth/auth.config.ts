import type { Context } from 'hono'
import type { CookieOptions } from 'hono/utils/cookie'

const cookieOptions: CookieOptions = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 60 * 60
}

export const getCookieOptions = (c: Context): CookieOptions => {
  const domain = new URL(c.req.url).hostname
  return {
    ...cookieOptions,
    secure: process.env.NODE_ENV === 'production',
    domain
  }
}
