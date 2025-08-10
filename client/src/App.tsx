import { useEffect, useState } from 'react'
import { hcWithType } from 'server/dist/client'
import { Route, Routes } from 'react-router'
import SignUpPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import DefaultLayout from './components/layout/DefaultLayout'
import { SERVER_URL } from './util/constants'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'

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
          <Route index element={<HomePage products={products} />} />
          <Route path="register" element={<SignUpPage />}  />
          <Route path="cart" element={<CartPage products={products?.slice(0, 3)} />}  />
          <Route path="login" element={<LoginPage />}  />
        </Routes>
      </DefaultLayout>
      {data?.message}
    </div>
  )
}

export default App
