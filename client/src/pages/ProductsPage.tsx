import {
  QueryClient,
  queryOptions,
  useSuspenseQuery
} from '@tanstack/react-query'
import {
  CategoriesResponse,
  getCategories,
  getProducts,
  ProductsResponse
} from '../lib/api'
import { Product } from '../components/Product'
import { Link, LoaderFunctionArgs, useSearchParams } from 'react-router'
import { ProductsGrid } from '../components/ProductsGrid'
import { PanelLeftIcon } from 'lucide-react'
import { formatCents } from '../util/util'

interface FilterMenuProps {
  categories: CategoriesResponse | undefined
  handleFilter: (category: string | null) => void
}

const FilterMenu = ({ categories, handleFilter }: FilterMenuProps) => {
  return (
    <ul className="menu">
      <li className="menu-title">Filters</li>
      <li>
        <details open>
          <summary>Category</summary>
          <ul>
            {categories &&
              categories.map(({ category }) => (
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
  )
}

interface ProductsGridProps {
  products: ProductsResponse
}

const ProductsSide = ({ products }: ProductsGridProps) => {
  return (
    <ProductsGrid>
      {products.map((p) => (
        <Link to={`/product/${p.id}`} key={p.id}>
          <div className="h-fit w-full sm:w-64">
            <Product product={p} text={formatCents(p.price)} />
          </div>
        </Link>
      ))}
    </ProductsGrid>
  )
}

const productsQuery = (currentCategory: string | undefined) =>
  queryOptions({
    queryKey: ['products', currentCategory],
    queryFn: () => getProducts(currentCategory)
  })

const categoriesQuery = queryOptions({
  queryKey: ['categories'],
  queryFn: getCategories
})

export const loader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const searchParams = new URL(request.url).searchParams
    const category = searchParams.get('category')

    const products = await queryClient.ensureQueryData(
      productsQuery(category || undefined)
    )
    const categories = await queryClient.ensureQueryData(categoriesQuery)
    return { products, categories }
  }

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentCategory = searchParams.get('category')

  const { data: products } = useSuspenseQuery(
    productsQuery(currentCategory ?? '')
  )

  const { data: categories } = useSuspenseQuery(categoriesQuery)

  const handleFilter = (category: string | null) => {
    setSearchParams(category ? { category } : {})
  }

  return (
    <div className="drawer lg:drawer-open">
      <input type="checkbox" id="drawer" className="drawer-toggle" />
      <div className="drawer-side">
        <label
          htmlFor="drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <aside className="bg-base-100 min-h-full w-64 pt-4">
          <FilterMenu categories={categories} handleFilter={handleFilter} />
          {currentCategory && (
            <button className="btn" onClick={() => handleFilter('')}>
              Clear filters
            </button>
          )}
        </aside>
      </div>
      <div className="drawer-content">
        <div className="bg-base-200 flex h-14 min-w-full items-center p-2 lg:hidden">
          <label htmlFor="drawer" className="btn drawer-button">
            <PanelLeftIcon />
          </label>
        </div>
        <div className="grid justify-center p-4">
          <ProductsSide products={products} />
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
