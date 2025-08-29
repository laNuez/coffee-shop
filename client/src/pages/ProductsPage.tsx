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
          <div className="h-fit w-64">
            <Product product={p} />
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
  queryFn: getCategories,
  staleTime: Infinity
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
    <div className="grid grid-cols-5">
      <div>
        <FilterMenu categories={categories} handleFilter={handleFilter} />
        {currentCategory && (
          <button className="btn" onClick={() => handleFilter('')}>
            Clear filters
          </button>
        )}
      </div>
      <div className="col-span-4">
        <ProductsSide products={products} />
      </div>
    </div>
  )
}

export default ProductsPage
