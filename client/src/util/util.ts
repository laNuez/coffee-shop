import { InferResponseType } from 'hono'
import { StatusCode, SuccessStatusCode } from 'hono/utils/http-status'

export const formatCents = (cents: number) => {
  const dollar = cents / 100
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'usd'
  }).format(dollar)
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export type ApiError = {
  error: string
}

export const getImageUrl = (key: string) => {
  return key
    ? `${import.meta.env.VITE_IMAGE_PREFIX_URL}${key}`
    : 'https://placehold.co/600x400'
}

// https://github.com/honojs/hono/issues/4270

// Internal helper to get all possible status codes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InferStatusCode<T extends (...args: any[]) => Promise<any>> =
  Awaited<ReturnType<T>> extends { readonly status: infer S extends StatusCode }
    ? S
    : never

/**
 * Infers the error response body type from an RPC client function.
 * It extracts all possible response types for non-success status codes.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferErrorResponseType<T extends (...args: any[]) => Promise<any>> =
  InferResponseType<T, Exclude<InferStatusCode<T>, SuccessStatusCode>>

/**
 * Infers the success response body type from an RPC client function.
 * It extracts all possible response types for success status codes (2xx).
 */
export type InferSuccessResponseType<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any[]) => Promise<any>
> = InferResponseType<T, SuccessStatusCode>
