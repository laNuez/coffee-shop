import { Product as ProductType } from 'shared'
import { formatCents } from '../util/util'

import { X } from 'lucide-react';

interface CartPageProps {
  products: ProductType[] | undefined
}

interface ShoppingCart {
  userId: number
  productId: number
  quantity: number
  price: number
}

const CartPage = (props: CartPageProps) => {
  if (!props.products) return <div>empty</div>
  // mock shopping cart
  const shoppingCart: ShoppingCart[] = props.products?.map((p) => {
    return {
      userId: 1,
      productId: p.id,
      price: p.price,
      quantity: Math.ceil(Math.random() * 4),
    }
  })

  // should i fetch the products? or i use what i have?
  const productsInCart = props.products?.filter((p) =>
    shoppingCart.find((item) => p.id === item.productId)
  )
  const getProduct = (id: number) =>
    shoppingCart.find((item) => item.productId === id)!
  return (
    <div className="flex w-screen mt-2 justify-center bg-base-200">
      <div className='p-4'>
        <h2 className='text-xl font-bold'>Shopping cart</h2>
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
            {productsInCart.map((p) => (
              <tr>
                <td>{p.name}</td>
                <td>{getProduct(p.id)?.quantity}</td>
                <td>
                  {formatCents(
                    getProduct(p.id).price * getProduct(p.id).quantity
                  )}
                </td>
                <td>{p.name}</td>
                <td>{p.name}</td>
                <td>
                  <button className='btn btn-square bg-base-100 hover:bg-base-200'><X /></button>
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
              <span className='mr-10'>Subtotal</span>
              <span>$$</span>
            </div>
            <div>
              <span className='mr-10'>Shipping</span>
              <span>Free</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
