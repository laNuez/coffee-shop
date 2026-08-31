import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { formatCents, getImageUrl } from '../util/util'

import { checkout, delCartItem } from '../lib/api'
import { XIcon } from 'lucide-react'
import { Link } from 'react-router'
import { Image } from '../components/Image'
import { cartQuery } from '../routes/cart'
import { Table } from '../components/Table'
import { useDebounceCallback } from '../hooks/useDebounceCallback'
import { useUpdateCartItem } from '../hooks/useUpdateCartItem'
import { QuantitySelector } from '../components/QuantitySelector'

const CartPage = () => {
  const { data: cart } = useSuspenseQuery(cartQuery)

  const queryClient = useQueryClient()
  const itemDelMutation = useMutation({
    mutationFn: (id: string) => delCartItem({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQuery.queryKey })
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

  const { mutate: itemQuantityMutation } = useUpdateCartItem()

  const debouncedUpdateCartItem = useDebounceCallback(
    (id: string, quantity: number) => {
      itemQuantityMutation({ id, quantity })
    },
    300
  )

  const handleQuantityChange = async (id: string, quantity: number) => {
    const safeQuantity = Math.max(0, Math.min(100, quantity))

    await queryClient.cancelQueries({ queryKey: cartQuery.queryKey })
    queryClient.setQueryData(cartQuery.queryKey, (prev) =>
      prev?.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: safeQuantity
            }
          : item
      )
    )

    if (safeQuantity === 0) {
      debouncedUpdateCartItem.cancel()
      handleDel(id)
      return
    }

    debouncedUpdateCartItem.debounced(id, safeQuantity)
  }

  const isDeleting = (itemId: string) =>
    itemDelMutation.isPending && itemDelMutation.variables === itemId

  return (
    <div className="mx-auto grid min-h-96 max-w-4xl grid-cols-1 p-4 lg:grid-cols-[2fr_1fr]">
      <div className="bg-base-200 md:p4 p-2">
        <h2 className="mb-4 text-xl font-bold">Shopping cart</h2>
        {cart.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto md:flex">
              <Table
                data={cart}
                columns={[
                  {
                    header: 'Image',
                    accessor: (row) => (
                      <figure className="aspect-[1264/848] max-w-52 rounded-sm">
                        <Image
                          src={getImageUrl(row.product.image)}
                          alt={row.product.name}
                          className="object-fit"
                          width={100}
                        />
                      </figure>
                    )
                  },
                  {
                    header: 'Product',
                    accessor: (row) => row.product.name
                  },
                  {
                    header: 'Quantity',
                    accessor: (row) => (
                      <QuantitySelector
                        quantity={row.quantity}
                        onDecrease={() =>
                          handleQuantityChange(row.id, row.quantity - 1)
                        }
                        onIncrease={() =>
                          handleQuantityChange(row.id, row.quantity + 1)
                        }
                        disableIncrease={
                          row.quantity === 100 || isDeleting(row.id)
                        }
                        disableDecrease={
                          row.quantity === 0 || isDeleting(row.id)
                        }
                      />
                    )
                  },
                  {
                    header: 'Total price',
                    accessor: (row) =>
                      formatCents(row.product.price * row.quantity)
                  },
                  {
                    header: 'Actions',
                    accessor: (row) => (
                      <button
                        onClick={() => handleDel(row.id)}
                        className="btn btn-square bg-base-100 hover:bg-base-200"
                        disabled={
                          itemDelMutation.isPending &&
                          itemDelMutation.variables === row.id
                        }
                      >
                        <XIcon />
                      </button>
                    )
                  }
                ]}
              />
            </div>
            {/* mobile */}
            <div className="grid gap-3 md:hidden">
              {cart.map((item) => (
                <div
                  className="card card-side bg-base-100 shadow-sm"
                  key={item.id}
                >
                  <figure className="aspect-[1264/848] w-40 md:w-50">
                    <Image
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
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
                        disabled={
                          itemDelMutation.isPending &&
                          itemDelMutation.variables === item.id
                        }
                      >
                        <XIcon />
                      </button>
                    </div>
                    <p>{item.product.description}</p>
                    <div className="card-actions mt-1">
                      <div className="flex h-full w-16 items-center text-right font-medium">
                        {formatCents(item.product.price * item.quantity)}
                      </div>
                      <QuantitySelector
                        quantity={item.quantity}
                        onDecrease={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        onIncrease={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        disableIncrease={
                          item.quantity === 100 || isDeleting(item.id)
                        }
                        disableDecrease={
                          item.quantity === 0 || isDeleting(item.id)
                        }
                        buttonClassName="btn-sm btn-square"
                      />
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
      <div className="bg-base-300">
        <div className="sticky top-0 flex h-full max-h-92 min-h-56 flex-col justify-between gap-4 p-4">
          <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
          <div className="flex justify-between">
            <span className="mr-10">Subtotal</span>
            <span className="w-18 text-left">{formatCents(totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="w-20 pr-2 text-right">Free</span>
          </div>
          <hr />
          <div className="flex justify-between">
            <span>Total</span>
            <span className="w-18 text-left">{formatCents(totalPrice)}</span>
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
                : 'Add items to continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartPage
