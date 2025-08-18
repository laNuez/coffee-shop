import { ENV } from '@server/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: ENV.TURSO_DATABASE_URL,
    authToken: ENV.TURSO_AUTH_TOKEN
  },
  casing: 'snake_case'
})
