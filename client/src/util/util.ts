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

const TRANS_URL = import.meta.env.VITE_IMAGE_TRANSFORM_URL
export const getOptimizeImage = (src: string, width: number) => {
  const url = new URL(src)
  if (!TRANS_URL) return src

  const trans = new URL(TRANS_URL)
  if (url.origin !== trans.origin) return src

  return `${url.origin}/cdn-cgi/image/width=${width},format=auto${url.pathname}`
}

export const getImageUrl = (key: string) => {
  return key
    ? `${import.meta.env.VITE_IMAGE_PREFIX_URL}/${key}`
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

export const formatDate = (date: string) => {
  return Intl.DateTimeFormat('en-us', {
    dateStyle: 'long'
  }).format(new Date(date))
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}

export class NotFoundError extends Error {
  constructor() {
    super('Not Found')
    this.name = 'NotFoundError'
  }
}
