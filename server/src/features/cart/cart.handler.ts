import { getCartByUserId } from '@server/db/queries'
import type { Variables } from '@server/types'
import { Hono } from 'hono'
import type { ApiResponse } from 'shared/dist'

const app = new Hono<Variables>()
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
    if (!cart) return c.json({ error: 'not found' }, 404)

    return c.json({ cart })
  })

export default app
