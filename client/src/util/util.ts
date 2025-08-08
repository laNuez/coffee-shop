export const formatCents = (cents: number) => {
  const dollar = cents / 100
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'usd',
  }).format(dollar)
}
