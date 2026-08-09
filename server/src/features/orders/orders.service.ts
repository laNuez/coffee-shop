import {
  createOrder,
  createOrderItem,
  updateOrderById
} from '@server/db/mutations'
import { getCartByUserId, getOrder } from '@server/db/queries'
import { ENV } from '@server/env'
import stripeService from '@server/services/stripe'
import type { Order, UserFromToken } from '@server/types'
import { HTTPException } from 'hono/http-exception'
import type Stripe from 'stripe'
import cartService from '../cart/cart.service'
import z from 'zod'

const createCheckout = async (user: UserFromToken, origin: string) => {
  const cart_items = await getCartByUserId(user.id)
  if (!cart_items.length)
    throw new HTTPException(404, { message: 'Cart not found' })

  let totalAmount = cart_items.reduce(
    (acc, curr) => acc + curr.quantity * curr.product.price,
    0
  )

  const order = await createOrder({
    userId: user.id,
    totalAmount
  })

  const orderItems = cart_items.map((item) => ({
    orderId: order.id,
    price: item.product.price,
    productId: item.productId,
    quantity: item.quantity
  }))

  await createOrderItem(orderItems)

  const actualOrder = await getOrder(order.id)
  if (!actualOrder) throw new HTTPException(404, { message: 'Order not found' })

  const stripeSession = await stripeService.createSession({
    line_items: itemsPayload(actualOrder),
    metadata: {
      userId: user.id,
      orderId: order.id
    },
    success_url: `${origin}/`,
    cancel_url: `${origin}/cart`,
    customer_email: user.email
  })
  if (!stripeSession.url)
    throw new HTTPException(502, { message: 'Service unavailable' })

  return stripeSession.url
}

const itemsPayload = (
  order: Order
): Stripe.Checkout.SessionCreateParams.LineItem[] => {
  return order.items.map((e) => {
    return {
      price_data: {
        currency: 'mxn',
        product_data: {
          name: e.product.name,
          description: e.product.description,
          images: [`${ENV.IMAGE_PREFIX}${e.product.image}`]
        },
        // i just want mxn quickly
        unit_amount: Math.round(e.product.price * 17.12)
      },
      quantity: e.quantity
    }
  })
}

const stripeMetadataSchema = z.object({
  orderId: z.string(),
  userId: z.string()
})

const handleWebhook = async (
  body: string,
  signature: string,
  webhook_secret = ENV.STRIPE_WEBHOOK_SECRET
) => {
  const event = await stripeService.webhook(body, signature, webhook_secret)

  switch (event.type) {
    case 'payment_intent.created':
      console.log('payment created')
      break

    case 'payment_intent.canceled':
      console.log('payment canceled :(')
      break

    case 'payment_intent.succeeded':
      const { success, data } = stripeMetadataSchema.safeParse(
        event.data.object.metadata
      )
      if (!success) throw Error('Unexpected metadata')

      await cartService.clear(data.userId)
      await updateOrderById(data.orderId, { status: 'paid' })

      break

    default:
      console.log(`Forgot to handle: ${event.type}`)
      break
  }
}

const ordersService = {
  createCheckout,
  handleWebhook
}

export default ordersService
