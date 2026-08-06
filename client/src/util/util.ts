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
