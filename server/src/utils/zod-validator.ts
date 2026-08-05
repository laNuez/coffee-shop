// https://github.com/honojs/middleware/tree/main/packages/zod-validator
import type { ValidationTargets } from 'hono'
import { zValidator as zv } from '@hono/zod-validator'
import { HTTPException } from 'hono/http-exception'
import z from 'zod'

export const zValidator = <
  T extends z.ZodSchema,
  Target extends keyof ValidationTargets
>(
  target: Target,
  schema: T
) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      if (process.env.NODE_ENV !== 'production') {
        return c.json({ error: z.treeifyError(result.error) }, 400)
      }
      throw new HTTPException(400, { message: 'Bad request' })
    }
  })
