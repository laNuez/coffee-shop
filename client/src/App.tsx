import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router'
import SignUpPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import DefaultLayout from './components/layout/DefaultLayout'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import { useFetchUser } from './stores/userStore'
import { client } from './lib/hono'
import { AuthError } from './util/util'

type ResponseType = Awaited<ReturnType<typeof client.hello.$get>>
type ProductsType = Awaited<ReturnType<typeof client.products.$get>>

function App() {
  const [data, setData] = useState<Awaited<ReturnType<ResponseType["json"]>> | undefined>()
  const [products, setProducts] = useState<Awaited<ReturnType<ProductsType["json"]>> | undefined>()

  const fetchUser = useFetchUser()
  const navigate = useNavigate()

  useEffect(() => {
    fetchUser().catch((error) => {
      if (error instanceof AuthError) {
        navigate('/login')
      }
      console.error(error)
    })
  }, [fetchUser, navigate])

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
