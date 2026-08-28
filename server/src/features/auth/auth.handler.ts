import { userInsertSchema } from '@server/db/schema'
import { Hono } from 'hono'
import z from 'zod'
import { deleteCookie, setCookie } from 'hono/cookie'
import type { Variables } from '@server/types'
import { requireAuth } from '@server/middleware/userContext'
import userService, { loginSchema } from './auth.service'
import { getCookieOptions } from './auth.config'
import { zValidator } from '@server/utils/zod-validator'

const app = new Hono<Variables>()
  .post('/register', zValidator('json', userInsertSchema), async (c) => {
    const data = c.req.valid('json')
    const user = await userService.register(data)
    return c.json(user, 201)
  })

  .post('/login', zValidator('json', loginSchema), async (c) => {
    const data = c.req.valid('json')
    const accessToken = await userService.login(data)

    setCookie(c, 'access_token', accessToken, getCookieOptions(c))

    return c.body(null, 200)
  })
  .post('/logout', requireAuth, (c) => {
    deleteCookie(c, 'access_token', getCookieOptions(c))
    return c.body(null, 200)
  })
  .get('/me', requireAuth, (c) => {
    const user = c.get('currentUser')!
    return c.json(user, 200)
  })

export default app
