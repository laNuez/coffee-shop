import z from 'zod'

const envSchema = z.object({
  TURSO_DATABASE_URL: z.string().startsWith('libsql://'),
  TURSO_AUTH_TOKEN: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  BUCKET_ID: z.string().min(1),
  BUCKET_NAME: z.string().min(1),
  BUCKET_SECRET: z.string().min(1),
  BUCKET_ENDPOINT: z.string().startsWith('https://')
})

export const ENV = envSchema.parse(process.env)
