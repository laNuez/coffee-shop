import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formatCents } from '../util/util'

import { delCartItem, getCart } from '../lib/api'
import { X } from 'lucide-react'
import { NavLink } from 'react-router'

const CartPage = () => {
  const {
    data: cart,
    isPending,
    error
  } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart
  })

  const queryClient = useQueryClient()
  const itemDelMutation = useMutation({
    mutationFn: (id: string) => delCartItem({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })

  const handleDel = (id: string) => {
    itemDelMutation.mutate(id)
  }

  if (isPending) return <div>fetching</div>
  if (error) return <div>error</div>

  return (
    <div className="mx-auto grid min-h-96 max-w-4xl grid-cols-1 p-4 lg:grid-cols-[2fr_1fr]">
      <div className="bg-base-200 p-4">
        <h2 className="mb-4 text-xl font-bold">Shopping cart</h2>
        {cart.length > 0 ? (
          <table className="table w-full">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.product.name}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCents(item.product.price * item.quantity)}</td>
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
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-medium">Such empty</h3>
              <NavLink to="/" className="link hover:text-primary">
                Continue Shopping
              </NavLink>
            </div>
          </div>
        )}
      </div>
      <div className="bg-base-300 flex min-h-56 flex-col justify-between p-4">
        <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
        <div className="flex justify-between">
          <span className="mr-10">Subtotal</span>
          <span>
            {formatCents(
              cart.reduce((acc, curr) => {
                return acc + curr.quantity * curr.product.price
              }, 0)
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <hr />
        <div className="flex justify-between">
          <span>Total</span>
          <span>Free</span>
        </div>
        <button className="btn btn-primary w-full">Proceed to Checkout</button>
      </div>
    </div>
  )
}

export default CartPage
