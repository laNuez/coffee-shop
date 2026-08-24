import { ENV } from '@server/env'
import Stripe from 'stripe'

const stripeClient = new Stripe(ENV.STRIPE_SECRET)

export type CheckoutSessionOptions = {
  line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
  metadata: {
    userId: string
    orderId: string
  }
  success_url: string
  cancel_url: string
  customer_email: string
}

const createSession = async ({
  line_items,
  metadata,
  success_url,
  cancel_url,
  customer_email
}: CheckoutSessionOptions) => {
  const session = await stripeClient.checkout.sessions.create({
    line_items: line_items,
    mode: 'payment',
    success_url: success_url,
    cancel_url: cancel_url,
    payment_method_types: ['card'],
    payment_intent_data: {
      metadata: metadata
    },
    customer_email: customer_email
  })

  return session
}

export type ConstructEventAsync = Parameters<
  typeof stripeClient.webhooks.constructEventAsync
>
const webhook = async (...args: ConstructEventAsync) => {
  const event = stripeClient.webhooks.constructEventAsync(...args)

  return event
}

const stripeService = {
  createSession,
  webhook
}

export default stripeService
