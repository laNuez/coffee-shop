import { createProduct, deleteProduct } from '@server/db/mutations'
import { getProductById, getProducts } from '@server/db/queries'
import { productInsertSchema } from '@server/db/schema'
import { Hono } from 'hono'
import z from 'zod'

const app = new Hono()
  // TODO: implement auth
  .post('/', async (c) => {
    const body = await c.req.json()
    const { data, success, error } = productInsertSchema.safeParse(body)

    if (!success) return c.json({ error: z.treeifyError(error) }, 400)

    const [product] = await createProduct(data)
    if (!product) return c.json({ error: 'something went wrong' }, 500)

    return c.json(product, 201)
  })

  .get('/', async (c) => {
    const products = await getProducts()
    return c.json(products)
  })

  .delete('/:id', async (c) => {
    const id = c.req.param('id')
    const { rowsAffected } = await deleteProduct(id)

    if (!rowsAffected) return c.json({ error: 'not found' }, 404)

    return c.body(null, 204)
  })

  .get('/:id', async (c) => {
    const id = c.req.param('id')
    const product = await getProductById(id)
    if (!product) return c.json({ error: 'not found' }, 404)

    return c.json(product)
  })

export default app
