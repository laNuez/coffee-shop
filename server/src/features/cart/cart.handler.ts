import { addToCart, deleteFromCart, updateCartItem } from '@server/db/mutations'
import { getCartByUserId, getCartItemById } from '@server/db/queries'
import { cartItemInsertSchema, cartItemPatchSchema } from '@server/db/schema'
import { isUniqueConstraintError } from '@server/db/utils'
import { requireAuth } from '@server/middleware/userContext'
import type { Variables } from '@server/types'
import { Hono } from 'hono'

const app = new Hono<Variables>()
  .get('/', requireAuth, async (c) => {
    const user = c.get('currentUser')
    if (!user) return c.json({ error: 'log in' }, 403)

    const cart = await getCartByUserId(user.id)
    if (!cart) return c.json({ error: 'not found' }, 404)

    return c.json(cart)
  })

  .post('/', requireAuth, async (c) => {
    const user = c.get('currentUser')
    if (!user) {
      return c.json({ error: 'log in' }, 403)
    }

    const body = await c.req.json().catch(() => null)

    const { success, data, error } = cartItemInsertSchema.safeParse({
      ...body,
      userId: user.id
    })

    if (!success) {
      return c.json({ error: 'Unprocessable Content' }, 422)
    }

    try {
      const row = await addToCart(data)
      return c.json(row, 201)
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        return c.json({ error: 'conflict' }, 409)
      }

      return c.json({ error: 'something went wrong' }, 500)
    }
  })

  .patch('/:id', requireAuth, async (c) => {
    const user = c.get('currentUser')
    if (!user) {
      return c.json({ error: 'log in' }, 403)
    }

    const { id } = c.req.param()
    const body = await c.req.json().catch(() => null)

    const { success, data, error } = cartItemPatchSchema.safeParse(body)
    if (!success) {
      return c.json({ error: 'Unprocessable Content' }, 422)
    }

    const cartItem = await getCartItemById(user.id, id)
    if (!cartItem) return c.json({ error: 'not found' }, 404)

    const row = await updateCartItem(cartItem.id, data)
    return c.json(row, 200)
  })

  .delete('/:id', requireAuth, async (c) => {
    const user = c.get('currentUser')
    if (!user) {
      return c.json({ error: 'log in' }, 403)
    }
    const { id } = c.req.param()
    const res = await deleteFromCart(user.id, id)
    if (!res.rowsAffected) return c.json({ error: 'not found' }, 404)

    return c.body(null, 204)
  })

export default app
