import { hc, type ApplyGlobalResponse } from 'hono/client'
import type { app } from './index'

export type AppType = ApplyGlobalResponse<
  typeof app,
  {
    500: {
      json: {
        error: string
      }
    }
  }
>

export type Client = ReturnType<typeof hc<AppType>>

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args)
