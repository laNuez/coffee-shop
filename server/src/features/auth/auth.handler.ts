import { db } from '@server/db/client'
import { userInsertSchema, usersTable } from '@server/db/schema'
import { DrizzleQueryError, eq, or } from 'drizzle-orm'
import { Hono } from 'hono'
import bcrypt from 'bcrypt'
import z from 'zod'
import { getUserByUsername } from '@server/db/queries'
import { sign } from 'hono/jwt'
import { deleteCookie, setCookie } from 'hono/cookie'
import type { Variables } from '@server/types'
import { createUser } from '@server/db/mutations'
import { ENV } from '@server/env'

const app = new Hono<Variables>()
  .post('/register', async (c) => {
    const body = await c.req.json()
    const { success, data, error } = userInsertSchema.safeParse(body)
    if (!success) {
      c.status(400)
      return c.json({ error: z.treeifyError(error) })
    }

    const [username] = await db
      .select({ username: usersTable.username })
      .from(usersTable)
      .where(
        or(
          eq(usersTable.username, data.username),
          eq(usersTable.email, data.email)
        )
      )

    if (username) {
      c.status(400)
      return c.json({ error: 'username or email already exists' })
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    try {
      const [user] = await createUser({ ...data, password: hashedPassword })

      if (!user) {
        c.status(400)
        return c.json({ error: 'something went wrong' })
      }

      const { password, ...remaining } = user
      return c.json({ ...remaining })
    } catch (error) {
      if (error instanceof DrizzleQueryError) {
        c.status(400)
        return c.json(error)
      }
      console.log(error)
      throw error
    }
  })

  .post('/login', async (c) => {
    const body = await c.req.json()
    const parseLoginForm = z.object({
      username: z.string(),
      password: z.string(),
    })

    const { success, data, error } = parseLoginForm.safeParse(body)
    if (!success) {
      return c.json(
        { error: 'invalid request', errors: z.treeifyError(error) },
        400
      )
    }

    const [user] = await getUserByUsername(data.username)
    if (!user) {
      return c.json({ error: 'wrong username or password' }, 401)
    }

    const correct = await bcrypt.compare(data.password, user.password)
    if (!correct) {
      return c.json({ error: 'wrong username or password' }, 401)
    }

    const { password, ...remaining } = user

    // expires in 60 minutes
    const exp = Math.floor(Date.now() / 1000) + 60 * 60
    const accessToken = await sign({ ...remaining, exp }, ENV.JWT_SECRET)
    const resData = {
      accessToken,
    }

    setCookie(c, 'access_token', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 1000 * 60 * 60,
      domain: 'localhost',
    })

    return c.json(resData, 200)
  })
  .get('/logout', (c) => {
    const xd = deleteCookie(c, 'access_token', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 1000 * 60 * 60,
      domain: 'localhost',
    })
    return c.body(null, 200)
  })
  .get('/me', (c) => {
    const user = c.get('currentUser')
    if (!user) return c.json(null, 401)

    return c.json(user, 200)
  })

export default app
