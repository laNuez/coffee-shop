import type { Variables } from '@server/types'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import ordersService from './orders.service'

const app = new Hono<Variables>().post('/checkout', async (c) => {
  const user = c.get('currentUser')
  if (!user) throw new HTTPException(403, { message: 'Forbidden' })

  const stripeSession = await ordersService.createCheckout(user.id)

  return c.json({ url: stripeSession }, 200)
})

export default app
