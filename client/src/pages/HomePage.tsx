import { Product as ProductType } from "shared"
import { Hero } from "../components/Hero"
import { ProductsGrid } from "../components/ProductsGrid"
import { Product } from "../components/Product"

interface HomePageProps {
  products: ProductType[] | undefined
}

const HomePage = ({products}: HomePageProps) => {
  return (
    <div>
      <Hero />
      <h2 id='coffee'>Featured</h2>
      <ProductsGrid>
        {products && products.filter((p)=> p.category === 'Beans').map(p => (
          <Product product={p} />
        ))}
      </ProductsGrid>
    </div>
  )
}

export default HomePage