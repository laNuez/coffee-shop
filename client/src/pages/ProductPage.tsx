import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { addToCart, AddToCartInput } from '../lib/api'
import { formatCents, getImageUrl } from '../util/util'
import { useRef, useState } from 'react'
import { Plus, Minus, Check } from 'lucide-react'
import { Modal } from '../components/Modal'
import { useUserStore } from '../stores/userStore'
import { Image } from '../components/Image'
import { productQuery } from '../routes/products'
type ProductParams = {
  id: string
}

const ProductPage = () => {
  const { id } = useParams() as ProductParams
  const [quantity, setQuantity] = useState(1)

  const user = useUserStore((state) => state.user)

  const { data: product } = useSuspenseQuery(productQuery(id))

  const queryClient = useQueryClient()
  const addToCartMutation = useMutation({
    mutationKey: ['cart'],
    mutationFn: (args: AddToCartInput) => addToCart(args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })

  const modalRef = useRef<HTMLDialogElement>(null)

  const handleAddToCart = () => {
    if (!user) {
      modalRef.current?.showModal()
      return
    }

    addToCartMutation.mutate({
      productId: id,
      quantity: quantity
    })
  }

  return (
    <div>
      <button popoverTarget="login-continue" className="hidden" />
      <Modal
        id="login-continue"
        ref={modalRef}
        actions={
          <div className="flex gap-3">
            <Link
              to="/login"
              state={{ path: location.pathname }}
              className="btn btn-secondary"
            >
              Log in
            </Link>
            <button className="btn btn-primary btn-outline">Close</button>
          </div>
        }
      >
        <p className="p-4 font-medium">Please login to continue</p>
      </Modal>
      <div className="grid items-center md:grid-cols-2">
        <div className="p-4">
          <figure className="aspect-[1264/848]">
            <Image
              src={getImageUrl(product.image)}
              alt={product.name}
              width={800}
              loading="eager"
              fetchPriority="high"
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
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                <Minus />
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                className="btn"
                onClick={() => setQuantity((prev) => Math.min(100, prev + 1))}
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
              <button className="btn btn-outline w-full">Wishlist</button>
              <button className="btn btn-outline w-full">Share</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
