import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse } from "shared/dist";
import { drizzle } from "drizzle-orm/libsql";
import { mockProducts } from "./mock";
import { userInsertSchema, usersTable } from './db/schema'
import bcrypt from 'bcrypt'
import { DrizzleQueryError, eq, or } from 'drizzle-orm'
import { createUser } from './db/mutations'
import z from 'zod'

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

export default app;