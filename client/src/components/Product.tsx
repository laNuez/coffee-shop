import { Product as ProductType } from 'shared'
import { formatCents } from '../util/util'
import { getImageUrl } from '../util/util'

interface ProductProps {
  product: ProductType
}

export const Product = (props: ProductProps) => {
  const { description, name, price, image } = props.product

  return (
    <div className="card bg-base-200 w-full hover:shadow-sm">
      <figure>
        <img src={getImageUrl(image)} alt={name} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>{description}</p>
        <div className="card-actions">
          <button className="btn btn-primary">
            Buy now: {formatCents(price)}
          </button>
        </div>
      </div>
    </div>
  )
}
