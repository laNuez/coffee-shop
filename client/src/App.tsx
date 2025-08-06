import { useEffect, useState } from 'react'
import { hcWithType } from 'server/dist/client'
import { Route, Routes } from 'react-router'
import SignUpPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import DefaultLayout from './components/layout/DefaultLayout'
import { Product } from './components/Product'
import { ProductsGrid } from './components/ProductsGrid'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'

type ResponseType = Awaited<ReturnType<typeof client.hello.$get>>;
type ProductsType = Awaited<ReturnType<typeof client.products.$get>>

const client = hcWithType(SERVER_URL);

function App() {
  const [data, setData] = useState<Awaited<ReturnType<ResponseType["json"]>> | undefined>()
  const [products, setProducts] = useState<Awaited<ReturnType<ProductsType["json"]>> | undefined>()

  useEffect(() => {
    const ping = async () => {
      const res = await client.hello.$get()
      if (!res.ok) return console.log('something went wrong')
      const data = await res.json()
      setData(data)
    }
    ping()
  }, [])
  
  useEffect(() => {
    const products = async () => {
      const res = await client.products.$get()
      if (!res.ok) return console.log('opo')
      const data = await res.json()
      setProducts(data)
    }
    products()
  }, [])
  
  return (
    <div>
      <DefaultLayout>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="register" element={<SignUpPage />} />
        </Routes>
      </DefaultLayout>
      {data?.message}
      <h2 id='coffee'>Featured</h2>
      <ProductsGrid>
        {products && products.filter((p)=> p.category === 'Beans').map(p => (
          <Product product={p} />
        ))}
      </ProductsGrid>
    </div>
  )
}

export default App
