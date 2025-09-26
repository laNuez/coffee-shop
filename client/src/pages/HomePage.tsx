import { Hero } from '../components/Hero'
import { Product } from '../components/Product'
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery
} from '@tanstack/react-query'
import { getProducts } from '../lib/api'
import { Link } from 'react-router'

const query = queryOptions({
  queryKey: ['products'],
  queryFn: () => getProducts()
})

export const loader = (queryClient: QueryClient) => async () => {
  return queryClient.ensureQueryData(query)
}

// TODO: actual featured products and stuff
const HomePage = () => {
  const { data: products } = useSuspenseQuery(query)

  return (
    <div>
      <Hero />
      <section className="grid justify-center p-4">
        <h2 id="coffee" className="text-2xl font-bold">
          Featured
        </h2>

        <div className="mt-4 grid justify-center">
          <div className="grid max-w-6xl gap-3 md:grid-cols-2 lg:grid-cols-3">
            {products &&
              products
                .filter((p) => p.category === 'Beans')
                .slice(0, 6)
                .map((p) => (
                  <Link to={`product/${p.id}`} key={p.id}>
                    <Product product={p} />
                  </Link>
                ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
