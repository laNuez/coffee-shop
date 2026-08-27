import { QueryClient, queryOptions } from '@tanstack/react-query'
import { getCart } from '../lib/api'

export const cartQuery = queryOptions({
  queryKey: ['cart'],
  queryFn: getCart
})

export const cartLoader = (queryClient: QueryClient) => async () => {
  queryClient.ensureQueryData(cartQuery)
}
