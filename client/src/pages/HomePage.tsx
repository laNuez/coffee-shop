import { Hero } from '../components/Hero'
import { Product } from '../components/Product'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { homeQuery } from '../routes/products'

const HomePage = () => {
  const { data: home } = useSuspenseQuery(homeQuery)

  return (
    <div>
      <Hero />
      <section className="grid justify-center p-4">
        <h2 id="coffee" className="text-3xl font-semibold">
          Featured
        </h2>

        <div className="mt-4 grid justify-center">
          <div className="grid max-w-6xl gap-3 md:grid-cols-2 lg:grid-cols-3">
            {home &&
              home.featured.map((p) => (
                <Link to={`product/${p.id}`} key={p.id}>
                  <Product product={p} />
                </Link>
              ))}
          </div>
        </div>

        <h2 id="popular" className="mt-16 text-3xl font-semibold">
          Popular
        </h2>
        <div className="mt-4 grid justify-center">
          <div className="grid max-w-6xl gap-3 md:grid-cols-2 lg:grid-cols-3">
            {home &&
              home.popular.map((p) => (
                <Link to={`product/${p.id}`} key={p.id}>
                  <Product product={p} />
                </Link>
              ))}
          </div>
        </div>

        <div className="m-4 flex flex-col items-center justify-center gap-2">
          <Link to="/products" className="btn btn-ghost btn-wide">
            View all
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
