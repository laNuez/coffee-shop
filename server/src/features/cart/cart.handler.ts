import { zValidator } from '@server/utils/zod-validator'
import { addToCart, deleteFromCart, updateCartItem } from '@server/db/mutations'
import { getCartByUserId, getCartItemById } from '@server/db/queries'
import { addToCartRequestSchema, cartItemPatchSchema } from '@server/db/schema'
import { requireAuth } from '@server/middleware/userContext'
import type { Variables } from '@server/types'
import { Hono } from 'hono'

const app = new Hono<Variables>()
  .get('/', requireAuth, async (c) => {
    const user = c.get('currentUser')!

    const cart = await getCartByUserId(user.id)
    if (!cart) return c.json({ error: 'not found' }, 404)

    return c.json(cart)
  })

  .post(
    '/',
    requireAuth,
    zValidator('json', addToCartRequestSchema),
    async (c) => {
      const user = c.get('currentUser')!
      const body = c.req.valid('json')

      const row = await addToCart({
        ...body,
        userId: user.id
      })
      return c.json(row, 201)
    }
  )

  .patch(
    '/:id',
    requireAuth,
    zValidator('json', cartItemPatchSchema),
    async (c) => {
      const user = c.get('currentUser')!
      const { id } = c.req.param()

      const data = c.req.valid('json')

      const cartItem = await getCartItemById(user.id, id)
      if (!cartItem) return c.json({ error: 'not found' }, 404)

      const row = await updateCartItem(cartItem.id, data)
      return c.json(row, 200)
    }
  )

  .delete('/:id', requireAuth, async (c) => {
    const user = c.get('currentUser')!
    const { id } = c.req.param()

    const res = await deleteFromCart(user.id, id)
    if (!res.rowsAffected) return c.json({ error: 'not found' }, 404)

    return c.body(null, 204)
  })

export default app
