import {
  QueryClient,
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { LoaderFunctionArgs, useParams } from 'react-router'
import { addToCart, AddToCartInput, getProduct } from '../lib/api'
import { formatCents } from '../util/util'
import { useState } from 'react'
import { Plus, Minus, Check } from 'lucide-react'
type ProductParams = {
  id: string
}

const productQuery = (id: string) =>
  queryOptions({
    queryKey: ['products', id],
    queryFn: () => {
      return getProduct(id)
    }
  })

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    return await queryClient.ensureQueryData(productQuery(params.id!))
  }

const ProductPage = () => {
  const { id } = useParams() as ProductParams
  const [quantity, setQuantity] = useState(1)

  const { data: product } = useSuspenseQuery(productQuery(id))

  const queryClient = useQueryClient()
  const addToCartMutation = useMutation({
    mutationKey: ['cart'],
    mutationFn: (args: AddToCartInput) => addToCart(args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })

  // TODO: what about when a product is already on the cart?
  // ill get a 409 conflict, i should change the backend
  // im having trouble with the rpc, the endpoints that need a body dont get the types correctly.
  // i can fix that using a validator, but why i didnt do that sooner? don't remember if i had a reason
  const handleAddToCart = () => {
    addToCartMutation.mutate({
      productId: id,
      quantity: quantity
    })
  }

  return (
    <div>
      <div className="grid items-center md:grid-cols-2">
        <div className="p-4">
          <figure>
            <img
              src="https://placehold.co/600x400"
              alt="https://placehold.co/600x400"
            />
          </figure>
        </div>
        <div className="flex max-w-96 flex-col gap-2 p-4">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <div>
            <span className="text-secondary">{formatCents(product.price)}</span>
          </div>
          {product.description}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <button
                className="btn"
                onClick={() =>
                  setQuantity((prev) => (prev - 1 > 1 ? prev - 1 : 1))
                }
              >
                <Minus />
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                className="btn"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                <Plus />
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
              >
                Add to cart
                {addToCartMutation.isSuccess && <Check />}
              </button>
            </div>
            <div className="flex w-20 items-center gap-2">
              <button className="btn btn-neutral btn-outline w-full">
                Wishlist
              </button>
              <button className="btn btn-neutral btn-outline w-full">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
