import { Product as ProductType } from 'shared'

interface ProductProps {
  product: ProductType
}

export const Product = (props: ProductProps) => {
  const { description, name, price } = props.product

  const formatCents = (cents: number) => {
    const dollar = cents / 100
    return Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'usd',
    }).format(dollar)
  }

  return (
    <div className="card w-96 bg-base-200 hover:shadow-sm">
      <figure>
        <img
          src="https://placehold.co/600x400"
          alt="https://placehold.co/600x400"
        />
      </figure>
      <div className="card-body">
        <h2 className='card-title'>{name}</h2>
        <p>{description}</p>
        <div className="card-actions">
          <button className='btn btn-primary'>Buy now: {formatCents(price)}</button>
        </div>
      </div>
    </div>
  )
}
