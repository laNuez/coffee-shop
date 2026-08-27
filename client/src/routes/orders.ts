import { QueryClient, queryOptions } from '@tanstack/react-query'
import { getOrders, getOrdersAdmin } from '../lib/api'

export const ordersQuery = queryOptions({
  queryKey: ['orders'],
  queryFn: getOrders
})

export const ordersLoader = (queryClient: QueryClient) => async () => {
  queryClient.ensureQueryData(ordersQuery)
}

export const adminOrdersQuery = () =>
  queryOptions({
    queryKey: ['orders', 'admin'],
    queryFn: () => getOrdersAdmin()
  })

export const adminOrdersLoader = (queryClient: QueryClient) => async () => {
  return await queryClient.ensureQueryData(adminOrdersQuery())
}
