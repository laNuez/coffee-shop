import { LibsqlError } from '@libsql/client'
import { DrizzleQueryError } from 'drizzle-orm'

export const isUniqueConstraintError = (error: unknown) => {
  if (!(error instanceof DrizzleQueryError)) return false
  if (!(error.cause instanceof LibsqlError)) return false

  if (error.cause.code === 'SQLITE_CONSTRAINT') return true

  return false
}
