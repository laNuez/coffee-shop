import {
  QueryClient,
  queryOptions,
  useSuspenseQuery
} from '@tanstack/react-query'
import { getOrders, Order as OrderType } from '../lib/api'

import { formatCents, formatDate, getImageUrl } from '../util/util'

const query = queryOptions({
  queryKey: ['orders'],
  queryFn: () => getOrders()
})

export const loader = (queryClient: QueryClient) => async () => {
  return queryClient.ensureQueryData(query)
}

interface OrderProps {
  order: OrderType
}

const Order = ({ order }: OrderProps) => {
  return (
    <div className="collapse-arrow bg-base-300 collapse">
      <input type="checkbox" />
      <div className="collapse-title">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-lg font-medium">Order placed | status</p>
            <p>{formatDate(order.createdAt)}</p>
          </div>
          <p className="text-center text-base font-medium">
            {formatCents(order.totalAmount)}
          </p>
        </div>
      </div>
      <div className="collapse-content bg-base-200 p-0">
        {order.items.map(({ product: p, quantity }) => (
          <div
            key={p.id}
            className="border-base-300 flex items-center gap-3 border-b p-4 last:border-b-0"
          >
            <div className="h-24 w-24">
              <img
                src={getImageUrl(p.image)}
                alt={p.name}
                className="h-full w-full object-cover rounded-sm"
              />
            </div>
            <p className="text-lg">
              {p.name} <br /> Quantity: {quantity}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

const OrdersPage = () => {
  const { data: orders } = useSuspenseQuery(query)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">My orders</h1>
      <p className="mb-4 text-lg">Track and review your past purchases</p>
      {orders.map((order) => (
        <div className="mb-4">
          <Order order={order} key={order.id} />
        </div>
      ))}
    </div>
  )
}

export default OrdersPage
