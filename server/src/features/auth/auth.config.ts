import { ENV } from '@server/env'
import type { CookieOptions } from 'hono/utils/cookie'

export const cookie_config: CookieOptions = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60,
  domain: ENV.DOMAIN
}
