import { userInsertSchema } from '@server/db/schema'
import { Hono } from 'hono'
import z from 'zod'
import { deleteCookie, setCookie } from 'hono/cookie'
import type { Variables } from '@server/types'
import { requireAuth } from '@server/middleware/userContext'
import userService, { loginSchema } from './auth.service'

const app = new Hono<Variables>()
  .post('/register', async (c) => {
    const body = await c.req.json().catch(() => {})
    const { success, data, error } = userInsertSchema.safeParse(body)
    if (!success) return c.json({ error: z.treeifyError(error) }, 400)

    const user = await userService.register(data)
    return c.json(user, 201)
  })

  .post('/login', async (c) => {
    const body = await c.req.json().catch(() => {})

    const { success, data, error } = loginSchema.safeParse(body)
    if (!success) return c.json({ error: z.treeifyError(error) }, 400)

    const accessToken = await userService.login(data)

    setCookie(c, 'access_token', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 1000 * 60 * 60,
      domain: 'localhost',
    })

    return c.body(null, 200)
  })
  .get('/logout', requireAuth, (c) => {
    deleteCookie(c, 'access_token', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 1000 * 60 * 60,
      domain: 'localhost',
    })
    return c.body(null, 200)
  })
  .get('/me', requireAuth, (c) => {
    const user = c.get('currentUser')
    if (!user) return c.json(null, 401)

    return c.json(user, 200)
  })

export default app
