import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { ApiResponse, Token } from 'shared'
import { drizzle } from 'drizzle-orm/libsql'
import { mockProducts } from './mock'
import { userInsertSchema, usersTable, productInsertSchema } from './db/schema'
import bcrypt from 'bcrypt'
import { DrizzleQueryError, eq, or } from 'drizzle-orm'
import { createProduct, createUser, deleteProduct } from './db/mutations'
import z from 'zod'
import {
  getCartByUserId,
  getProductById,
  getProducts,
  getUserByUsername,
} from './db/queries'
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
    const products = await getProducts()
    return c.json(products)
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
    const accessToken = await sign({ ...remaining, exp }, JWT_SECRET!)
    const resData: Token = {
      accessToken,
    }
    return c.json(resData, 200)
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
    if (!cart) return c.notFound()

    return c.json({ cart })
  })
  // TODO: implement auth
  .post('/products', async (c) => {
    const body = await c.req.json()
    const { data, success, error } = productInsertSchema.safeParse(body)

    if (!success) return c.json({ error: z.treeifyError(error) }, 400)

    const [product] = await createProduct(data)
    if (!product) return c.json({ error: 'something went wrong' }, 500)

    return c.json(product)
  })

  .delete('/products/:id', async (c) => {
    const id = c.req.param('id')
    const { rowsAffected } = await deleteProduct(id)

    if (!rowsAffected) return c.notFound()

    return c.body(null, 204)
  })

  .get('/products/:id', async (c) => {
    const id = c.req.param('id')
    const product = await getProductById(id)
    if (!product) return c.notFound()

    return c.json(product)
  })

export default app
