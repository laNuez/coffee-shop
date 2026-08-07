import { PropsWithChildren } from 'react'

export const ProductsGrid = (props: PropsWithChildren) => {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {props.children}
    </div>
  )
}
