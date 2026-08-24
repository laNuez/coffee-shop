import {
  QueryClient,
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { Table } from '../../components/Table'
import { Order, OrderRequest, updateOrder } from '../../lib/api'
import { formatCents, formatDate } from '../../util/util'
import { Pencil, Plus } from 'lucide-react'
import { getOrdersAdmin } from '../../lib/api'
import { OrderStatusModal } from '../../components/OrderStatusModal'
import { useState } from 'react'

const ordersQuery = () =>
  queryOptions({
    queryKey: ['orders', 'admin'],
    queryFn: () => getOrdersAdmin()
  })

export const loader = (queryClient: QueryClient) => async () => {
  return await queryClient.ensureQueryData(ordersQuery())
}

interface OrderEdit {
  id: string
  data: OrderRequest
}
const DashboardOrdersPage = () => {
  const { data: orders } = useSuspenseQuery(ordersQuery())

  const client = useQueryClient()

  const [order, setOrder] = useState<Omit<Order, 'items'> | null>()

  const orderEditMutation = useMutation({
    mutationKey: ['orders', 'admin'],
    mutationFn: ({ id, data }: OrderEdit) => updateOrder(id, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['orders'] })
      setOrder(null)
    }
  })

  const handleEdit = (id: string) => {
    const o = orders.find((e) => e.id == id)
    if (!o) throw new Error('product missing')
    setOrder(o)
  }

  const edit = (id: string, data: OrderRequest) => {
    orderEditMutation.mutate({
      data,
      id
    })
  }

  return (
    <div className="w-full p-2 pt-6">
      {order && (
        <OrderStatusModal
          order={order}
          handleEdit={edit}
          onClose={() => setOrder(null)}
        />
      )}
      <h2 className="mb-2 text-xl font-medium">Order List</h2>
      <div>
        <button type="button" className="btn btn-accent" disabled>
          <Plus />
          ADD
        </button>
      </div>
      <div className="overflow-x-auto">
        <Table
          data={orders}
          columns={[
            {
              header: '',
              accessor: (row) => <input type="checkbox" id={row.id} />
            },
            {
              header: 'Order ID',
              accessor: (row) => (
                <span
                  className="inline-block max-w-24 cursor-pointer truncate align-bottom select-all"
                  title={row.id}
                >
                  {row.id}
                </span>
              )
            },
            {
              header: 'Customer',
              accessor: (row) => row.customer.username
            },
            {
              header: 'Status',
              accessor: (row) => row.status
            },
            {
              header: 'Price',
              accessor: (row) => formatCents(row.totalAmount)
            },
            {
              header: 'Created',
              accessor: (row) => formatDate(row.createdAt)
            },
            {
              header: 'Actions',
              accessor: (row) => (
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost btn-square"
                    onClick={() => handleEdit(row.id)}
                  >
                    <Pencil />
                  </button>
                </div>
              )
            }
          ]}
        />
      </div>
    </div>
  )
}

export default DashboardOrdersPage
