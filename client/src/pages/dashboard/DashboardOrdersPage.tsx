import {
  QueryClient,
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { Table } from '../../components/Table'
import { OrderRequest, updateOrder } from '../../lib/api'
import { formatCents } from '../../util/util'
import { Pencil, Plus } from 'lucide-react'
import { getOrdersAdmin } from '../../lib/api'

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

  const orderEditMutation = useMutation({
    mutationKey: ['orders', 'admin'],
    mutationFn: ({ id, data }: OrderEdit) => updateOrder(id, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  const handleEdit = (id: string) => {
    orderEditMutation.mutate({
      data: {
        status: 'shipped'
      },
      id
    })
  }

  return (
    <div className="m-8">
      <h2 className="text-xl">Order List</h2>
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
              header: 'User',
              accessor: (row) => row.userId
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
