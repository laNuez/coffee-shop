import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { ApiResponse, Token } from 'shared'
import { drizzle } from 'drizzle-orm/libsql'
import { mockProducts } from './mock'
import { userInsertSchema, usersTable } from './db/schema'
import bcrypt from 'bcrypt'
import { DrizzleQueryError, eq, or } from 'drizzle-orm'
import { createUser } from './db/mutations'
import z from 'zod'
import { getCartByUserId, getUserByUsername } from './db/queries'
import { verify, sign } from 'hono/jwt'
import { createMiddleware } from 'hono/factory'
import type { UserFromToken } from './types'
import * as schema from './db/schema'
import { JwtTokenExpired } from 'hono/utils/jwt/types'
const { JWT_SECRET } = process.env

type Variables = {
  Variables: {
    currentUser: null | UserFromToken
  }
}

export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  casing: 'snake_case',
  schema,
})

const userContext = createMiddleware(async (c, next) => {
  const auth = c.req.header('Authorization')
  if (!auth) {
    c.set('currentUser', null)
    return next()
  }
  const token = auth.split('Bearer ')[1]
  if (!token) {
    c.set('currentUser', null)
    return next()
  }

  try {
    const user = await verify(token, JWT_SECRET!)
    c.set('currentUser', user)
    return next()
  } catch (error) {
    if (!(error instanceof JwtTokenExpired)) {
      console.log(error)
    }
    c.set('currentUser', null)
    next()
  }
})

export const app = new Hono<Variables>()

  .use(cors())

  .use('/*', userContext)

  .get('/', (c) => {
    return c.text('Hello Hono!')
  })

  .get('/hello', async (c) => {
    const data: ApiResponse = {
      message: 'Hello BHVR!',
      success: true,
    }

    return c.json(data, { status: 200 })
  })
  .get('/products', async (c) => {
    return c.json(mockProducts)
  })

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
      c.status(400)
      return c.json({ error: 'invalid request' })
    }

    const [user] = await getUserByUsername(data.username)
    if (!user) {
      c.status(400)
      return c.json({ error: 'wrong username or password' })
    }

    const correct = await bcrypt.compare(data.password, user.password)
    if (!correct) {
      c.status(400)
      return c.json({ error: 'wrong username or password' })
    }

    const { password, ...remaining } = user

    // expires in 60 minutes
    const exp = Math.floor(Date.now() / 1000) + 60 * 60
    const accessToken = await sign({ ...remaining, exp }, JWT_SECRET!)
    const resData: Token = {
      accessToken,
    }
    return c.json(resData)
  })

  .get('/cart', async (c) => {
    const user = c.get('currentUser')
    const data: ApiResponse = {
      message: 'Must be logged in',
      success: false,
    }
    if (!user) {
      return c.json(data, 401)
    }

    const cart = await getCartByUserId(user.id)
    if (!cart) return c.status(404)

    return c.json({ cart })
  })

export default app
