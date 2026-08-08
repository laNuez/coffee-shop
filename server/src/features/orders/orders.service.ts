import { createOrder, createOrderItem } from '@server/db/mutations'
import { getCartByUserId, getOrder } from '@server/db/queries'
import { ENV } from '@server/env'
import stripeService from '@server/services/stripe'
import type { Order } from '@server/types'
import { HTTPException } from 'hono/http-exception'
import type Stripe from 'stripe'

const createCheckout = async (userId: string) => {
  const cart_items = await getCartByUserId(userId)
  if (!cart_items.length)
    throw new HTTPException(404, { message: 'Cart not found' })

  let totalAmount = cart_items.reduce(
    (acc, curr) => acc + curr.quantity * curr.product.price,
    0
  )

  const order = await createOrder({
    userId,
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

  const stripeSession = await stripeService.createSession(
    itemsPayload(actualOrder)
  )
  if (!stripeSession.url)
    throw new HTTPException(502, { message: 'Service unavailable' })

  // TODO: probably best with a stripe webhook
  // await deleteUserCart(userId)

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
        unit_amount: e.product.price
      },
      quantity: e.quantity
    }
  })
}

const ordersService = {
  createCheckout
}

export default ordersService
