import { zValidator } from '@server/utils/zod-validator'
import { createProduct, deleteProduct } from '@server/db/mutations'
import { getProductById, getProducts } from '@server/db/queries'
import { productInsertSchema, productUpdateSchema } from '@server/db/schema'
import { requireAdmin } from '@server/middleware/userContext'
import { Hono } from 'hono'
import { deleteImage, uploadImage } from './images.storage'
import productService from './products.service'

const app = new Hono()
  .post(
    '/',
    requireAdmin,
    zValidator('form', productInsertSchema),
    async (c) => {
      const data = c.req.valid('form')

      let imageKey: string | undefined
      try {
        imageKey = await uploadImage(data.image)
        const [product] = await createProduct({
          ...data,
          image: imageKey
        })

        if (!product) throw new Error('something went wrong')

        return c.json(product, 201)
      } catch (error) {
        console.error(error)
        if (imageKey) await deleteImage(imageKey)
        return c.json({ error: 'something went wrong' }, 500)
      }
    }
  )

  .get('/', async (c) => {
    const { category } = c.req.query()
    const products = await getProducts(category)
    return c.json(products)
  })

  .delete('/:id', requireAdmin, async (c) => {
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

  .patch(
    '/:id',
    requireAdmin,
    zValidator('form', productUpdateSchema),
    async (c) => {
      const id = c.req.param('id')
      const data = c.req.valid('form')

      const product = productService.update(id, data)
      return c.json(product, 200)
    }
  )
export default app
