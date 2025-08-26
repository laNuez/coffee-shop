import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../lib/api'
import { Product } from '../components/Product'
import { useState } from 'react'
import { Link } from 'react-router'

const ProductsPage = () => {
  const [filter, setFilter] = useState('')

  const { data, isPending, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  })

  if (isPending) return <div>loading</div>
  if (error) return <div>error</div>

  const byCategory = (p: (typeof data)[number]) => {
    return filter ? filter === p.category : true
  }

  const CATEGORIES = new Set(data.map((p) => p.category))
  const products = data.filter(byCategory)

  const handleFilter = (category: string) => {
    setFilter(category)
  }

  return (
    <div className="grid grid-cols-5">
      <div>
        <ul className="menu">
          <li className="menu-title">Filters</li>
          <li>
            <details open>
              <summary>Category</summary>
              <ul>
                {[...CATEGORIES].map((category) => (
                  <li key={category}>
                    <button onClick={() => handleFilter(category)}>
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        </ul>
        {filter && (
          <button className="btn" onClick={() => handleFilter('')}>
            Clear filters
          </button>
        )}
      </div>
      <div className="col-span-4">
        <div className="flex flex-wrap gap-4">
          {products.map((p) => (
            <Link to={`/product/${p.id}`} key={p.id}>
              <div className="h-fit w-64">
                <Product product={p} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
