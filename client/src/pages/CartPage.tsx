import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { formatCents, getImageUrl } from '../util/util'

import { checkout, delCartItem } from '../lib/api'
import { X } from 'lucide-react'
import { Link } from 'react-router'
import { Image } from '../components/Image'
import { cartQuery } from '../routes/cart'

const CartPage = () => {
  const { data: cart } = useSuspenseQuery(cartQuery)

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

  const checkoutMutation = useMutation({
    mutationFn: checkout,
    onSuccess: (checkoutSession) => (window.location.href = checkoutSession.url)
  })

  const totalPrice = cart.reduce(
    (acc, curr) => acc + curr.quantity * curr.product.price,
    0
  )

  return (
    <div className="mx-auto grid min-h-96 max-w-4xl grid-cols-1 p-4 lg:grid-cols-[2fr_1fr]">
      <div className="bg-base-200 md:p4 p-2">
        <h2 className="mb-4 text-xl font-bold">Shopping cart</h2>
        {cart.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto md:flex">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <figure className="max-w-52 rounded-sm">
                          <Image
                            src={getImageUrl(item.product.image)}
                            alt={item.product.name}
                            className="object-fit"
                            width={100}
                          />
                        </figure>
                      </td>
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
            </div>
            {/* mobile */}
            <div className="grid gap-3 md:hidden">
              {cart.map((item) => (
                <div
                  className="card card-side bg-base-100 shadow-sm"
                  key={item.id}
                >
                  <figure className="w-40 md:w-50">
                    <Image
                      src={getImageUrl(item.product.image)}
                      alt={item.product.image}
                      className="object-cover"
                      width={600}
                    />
                  </figure>
                  <div className="card-body w-full p-5">
                    <div className="flex justify-between">
                      <span className="card-title text-base">
                        {item.product.name}
                      </span>
                      <button
                        onClick={() => handleDel(item.id)}
                        className="btn btn-square bg-base-100 hover:bg-base-200"
                        disabled={itemDelMutation.isPending}
                      >
                        <X />
                      </button>
                    </div>
                    <p>{item.product.description}</p>
                    <div className="card-actions mt-1">
                      <div className="font-medium">
                        {formatCents(item.product.price * item.quantity)}
                      </div>
                      <div>Quantity: {item.quantity}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-medium">Such empty</h3>
              <Link to="/products" className="link hover:text-primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
      <div className="bg-base-300 flex min-h-56 flex-col justify-between gap-4 p-4">
        <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
        <div className="flex justify-between">
          <span className="mr-10">Subtotal</span>
          <span>{formatCents(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <hr />
        <div className="flex justify-between">
          <span>Total</span>
          <span>{formatCents(totalPrice)}</span>
        </div>
        <button
          className="btn btn-primary w-full"
          onClick={() => checkoutMutation.mutate()}
          disabled={checkoutMutation.isPending || !cart.length}
        >
          {checkoutMutation.isPending || checkoutMutation.isSuccess
            ? 'Redirecting...'
            : cart.length
              ? 'Proceed to Checkout'
              : 'Add items to the cart'}
        </button>
      </div>
    </div>
  )
}

export default CartPage
