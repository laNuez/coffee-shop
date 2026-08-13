import type { Variables } from '@server/types'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import ordersService from './orders.service'
import { ENV } from '@server/env'
import { requireAdmin, requireAuth } from '@server/middleware/userContext'
import { zValidator } from '@hono/zod-validator'
import { orderUpdateRequestSchema } from '@server/db/schema'
import { updateOrderById } from '@server/db/mutations'

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
  .get('/', requireAuth, async (c) => {
    const user = c.get('currentUser')!

    const orders = await ordersService.getAllUser(user.id)

    return c.json(orders, 200)
  })
  .patch(
    '/:id',
    requireAdmin,
    zValidator('json', orderUpdateRequestSchema),
    async (c) => {
      const { id } = c.req.param()
      const data = c.req.valid('json')

      if (!id) throw new HTTPException(404, { message: 'Not found' })

      const order = await updateOrderById(id, data)
      return c.json(order, 200)
    }
  )
  .get('/admin', requireAdmin, async (c) => {
    const orders = await ordersService.getAll()
    return c.json(orders, 200)
  })

export default app
