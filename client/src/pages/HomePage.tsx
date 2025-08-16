import { Hero } from '../components/Hero'
import { ProductsGrid } from '../components/ProductsGrid'
import { Product } from '../components/Product'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../lib/api'

const HomePage = () => {

  const { data: products, isPending } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })
  
  return (
    <div>
      <Hero />
      <h2 id="coffee" className='text-2xl font-bold'>Featured</h2>
      {isPending ? (
        <div>loading</div>
      ) : (
        <ProductsGrid>
          {products &&
            products
              .filter((p) => p.category === 'Beans')
              .map((p) => <Product product={p} />)}
        </ProductsGrid>
      )}
    </div>
  )
}

export default HomePage
