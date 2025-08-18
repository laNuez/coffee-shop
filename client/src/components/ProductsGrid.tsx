import { PropsWithChildren } from 'react'

export const ProductsGrid = (props: PropsWithChildren) => {
  return <div className="flex flex-wrap gap-3">{props.children}</div>
}
