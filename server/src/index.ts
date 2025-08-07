import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse, LoginForm, Token } from "shared/dist";
import { drizzle } from "drizzle-orm/libsql";
import { mockProducts } from "./mock";
import { userInsertSchema, usersTable } from './db/schema'
import bcrypt from 'bcrypt'
import { ConsoleLogWriter, DrizzleQueryError, eq, or } from 'drizzle-orm'
import { createUser } from './db/mutations'
import z from 'zod'
import { getUserByUsername } from "./db/queries";
import jwt from 'jsonwebtoken'

const {JWT_SECRET} = process.env

export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
})

export const app = new Hono()

  .use(cors())

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
          eq(usersTable.email, data.email),
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
      password: z.string()
    })

    const { success, data, error } = parseLoginForm.safeParse(body)
    if (!success) {
      c.status(400)
      return c.json({error: 'invalid request'})
    }

    const [user] = await getUserByUsername(data.username)
    if (!user) {
      c.status(400)
      return c.json({error: 'wrong username or password'})
    }

    const correct = await bcrypt.compare(data.password, user.password)
    if (!correct) {
      c.status(400)
      return c.json({error: 'wrong username or password'})
    }
    
    const {password, ...remaining} = user

    const accessToken = jwt.sign( {...remaining}, JWT_SECRET!, { expiresIn: '1h'})
    const resData: Token = {
      accessToken
    }
    return c.json(resData)
  })

export default app;