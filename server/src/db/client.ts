import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'
import { ENV } from '@server/env'

export const db = drizzle({
  connection: {
    url: ENV.TURSO_DATABASE_URL,
    authToken: ENV.TURSO_AUTH_TOKEN,
  },
  casing: 'snake_case',
  schema,
})
