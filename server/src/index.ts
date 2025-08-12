import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { ApiResponse } from 'shared'
import { mockProducts } from './mock'
import { userContext } from './middleware/userContext'
import auth from '@server/features/auth/auth.handler'
import products from '@server/features/products/products.handler'
import cart from '@server/features/cart/cart.handler'
import type { Variables } from './types'

export const app = new Hono<Variables>()

  .use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  )

  .use('/*', userContext)

  .get('/', (c) => {
    return c.text('Hello Hono!')
  })

  .get('/hello', async (c) => {
    const data: ApiResponse = {
      message: 'Hello BHVR!',
      success: true,
    }

    return c.json(data, { status: 200 })
  })

  .route('/', auth)
  .route('/', products)
  .route('/', cart)

export default app
