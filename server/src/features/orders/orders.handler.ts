import type { Variables } from '@server/types'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import ordersService from './orders.service'
import { ENV } from '@server/env'
import { requireAuth } from '@server/middleware/userContext'

const app = new Hono<Variables>()
  .post('/checkout', requireAuth, async (c) => {
    const user = c.get('currentUser')
    if (!user) throw new HTTPException(403, { message: 'Forbidden' })

    const origin = c.req.header('Origin')
    const allowed = ENV.ALLOWED_ORIGINS.find((e) => e === origin)
    if (!allowed) throw new HTTPException(400, { message: 'Bad request' })

    const stripeSession = await ordersService.createCheckout(user, origin!)

    return c.json({ url: stripeSession }, 200)
  })
  .post('/webhook', async (c) => {
    const signature = c.req.header('stripe-signature')
    if (!signature) throw new HTTPException(400, { message: 'Bad request' })

    const body = await c.req.text()

    await ordersService.handleWebhook(body, signature)

    return c.text('', 200)
  })

export default app
