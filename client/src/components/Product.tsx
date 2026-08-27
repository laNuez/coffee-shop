import { Product as ProductType } from 'shared'
import { formatCents } from '../util/util'
import { getImageUrl } from '../util/util'
import { Image } from './Image'

interface ProductProps {
  product: ProductType
  text?: string
}

export const Product = (props: ProductProps) => {
  const { description, name, price, image } = props.product

  const btnText = props.text ? props.text : `Buy now: ${formatCents(price)}`

  return (
    <div className="card bg-base-200 [[data-theme=dark]_&]:bg-base-300 w-full hover:shadow-sm">
      <figure className="aspect-[1264/848]">
        <Image
          src={getImageUrl(image)}
          alt={name}
          width={600}
          className="h-full w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>{description}</p>
        <div className="card-actions">
          <button className="btn btn-primary">{btnText}</button>
        </div>
      </div>
    </div>
  )
}
