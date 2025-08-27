import { getCategories } from '@server/db/queries'
import { Hono } from 'hono'

const app = new Hono().get('/', async (c) => {
  const categories = await getCategories()
  return c.json(categories, 200)
})

export default app
