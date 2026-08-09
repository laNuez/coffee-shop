import z from 'zod'

const envSchema = z.object({
  TURSO_DATABASE_URL: z.string().startsWith('libsql://'),
  TURSO_AUTH_TOKEN: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  BUCKET_ID: z.string().min(1),
  BUCKET_NAME: z.string().min(1),
  BUCKET_SECRET: z.string().min(1),
  BUCKET_ENDPOINT: z.string().startsWith('https://'),
  STRIPE_SECRET: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  IMAGE_PREFIX: z.string().startsWith('https://'),
  ALLOWED_ORIGINS: z.string().transform((e) => e.split(','))
})

export const ENV = envSchema.parse(process.env)
