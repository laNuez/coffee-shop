export const formatCents = (cents: number) => {
  const dollar = cents / 100
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'usd',
  }).format(dollar)
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}
