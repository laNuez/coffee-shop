import { ENV } from '@server/env'
import Stripe from 'stripe'

const stripeClient = new Stripe(ENV.STRIPE_SECRET)

const createSession = async (
  line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
) => {
  const session = await stripeClient.checkout.sessions.create({
    line_items: line_items,
    mode: 'payment',
    success_url: 'http://localhost:5173/todo_success',
    cancel_url: 'http://localhost:5173/cart',
    // oxxo mentioned lets go
    payment_method_types: ['card', 'oxxo']
  })

  return session
}

const stripeService = {
  createSession
}

export default stripeService
