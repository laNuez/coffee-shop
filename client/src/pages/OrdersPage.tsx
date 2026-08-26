import {
  QueryClient,
  queryOptions,
  useMutation,
  useSuspenseQuery
} from '@tanstack/react-query'
import { continueCheckout, getOrders, Order as OrderType } from '../lib/api'

import { formatCents, formatDate, getImageUrl } from '../util/util'
import { Link } from 'react-router'

const query = queryOptions({
  queryKey: ['orders'],
  queryFn: getOrders
})

export const loader = (queryClient: QueryClient) => async () => {
  queryClient.ensureQueryData(query)
}

interface OrderProps {
  order: OrderType
  onContinuePayment: (id: string) => void
  isContinuingPayment: boolean
}

const orderStatus: Partial<Record<OrderType['status'], string>> = {
  pending: 'badge-secondary',
  paid: 'badge-success',
  preparing: 'badge-warning',
  shipped: 'badge-info',
  delivered: 'badge-success'
}

const getBadge = (status: OrderType['status']) => {
  return orderStatus[status]
}

const Order = ({
  order,
  onContinuePayment,
  isContinuingPayment
}: OrderProps) => {
  return (
    <div className="collapse-arrow bg-base-300 collapse">
      <input type="checkbox" />
      <div className="collapse-title">
        <div className="flex items-center justify-between gap-6">
          <div className="flex gap-3">
            <div>
              <p className="text-lg font-medium">Order placed</p>
              <p>{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <span className={`badge badge-soft ${getBadge(order.status)}`}>
                {order.status}
              </span>
            </div>
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
                className="h-full w-full rounded-sm object-cover"
              />
            </div>
            <p className="text-lg">
              {p.name} <br /> Quantity: {quantity}
            </p>
          </div>
        ))}
      </div>
      {order.status === 'pending' && (
        <div className="p-4">
          <button
            onClick={() => {
              onContinuePayment(order.id)
            }}
            className="link"
            disabled={isContinuingPayment}
          >
            {isContinuingPayment ? 'Redirecting...' : 'Continue payment'}
          </button>
        </div>
      )}
    </div>
  )
}

const OrdersPage = () => {
  const { data: orders } = useSuspenseQuery(query)

  const continueCheckoutMutation = useMutation({
    mutationFn: continueCheckout,
    onSuccess: (checkoutSession) => (window.location.href = checkoutSession.url)
  })

  return (
    <div className="container mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-bold">My orders</h1>
      <p className="mb-4 text-lg">Track and review your past purchases</p>
      {orders.map((order) => (
        <div className="mb-4" key={order.id}>
          <Order
            order={order}
            onContinuePayment={(id) => continueCheckoutMutation.mutate(id)}
            isContinuingPayment={continueCheckoutMutation.isPending}
          />
        </div>
      ))}
      {orders.length === 0 && (
        <>
          <p className="mb-2">You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary">
            Browse coffee
          </Link>
        </>
      )}
    </div>
  )
}

export default OrdersPage
