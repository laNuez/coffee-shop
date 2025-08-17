import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formatCents } from '../util/util'

import { X } from 'lucide-react'
import { delCartItem, getCart } from '../lib/api'

const CartPage = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  })

  const queryClient = useQueryClient()
  const itemDelMutation = useMutation({
    mutationFn: (id: string) => delCartItem({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const handleDel = (id: string) => {
    itemDelMutation.mutate(id)
  }

  if (isPending) return <div>fetching</div>
  if (error) return <div>error</div>

  const cartItems = data.cart.map((i) => i)

  return (
    <div className="flex w-screen mt-2 justify-center bg-base-200">
      <div className="p-4">
        <h2 className="text-xl font-bold">Shopping cart</h2>
        <table className="table w-max overflow-scroll">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.product.name}</td>
                <td>{item.quantity}</td>
                <td>{formatCents(item.product.price * item.quantity)}</td>
                <td>{item.product.name}</td>
                <td>{item.product.name}</td>
                <td>
                  <button
                    onClick={() => handleDel(item.id)}
                    className="btn btn-square bg-base-100 hover:bg-base-200"
                    disabled={itemDelMutation.isPending}
                  >
                    <X />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between">
          <div>
            <button type="button" className="link">
              Go back
            </button>
          </div>
          <div className="flex justify-between w-max flex-col">
            <div>
              <span className="mr-10">Subtotal</span>
              <span>$$</span>
            </div>
            <div>
              <span className="mr-10">Shipping</span>
              <span>Free</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
