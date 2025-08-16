import { PropsWithChildren, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router'
import SignUpPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import DefaultLayout from './components/layout/DefaultLayout'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import { useFetchUser, useUserStore } from './stores/userStore'
import { client } from './lib/hono'
import { InferResponseType } from 'hono'

type ProductsType = InferResponseType<typeof client.products.$get>

function App() {
  const [products, setProducts] = useState<ProductsType>()

  const fetchUser = useFetchUser()
  const navigate = useNavigate()

  useEffect(() => {
    fetchUser().catch((error) => {
      console.error(error)
    })
  }, [fetchUser, navigate])

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
          <Route path="register" element={<SignUpPage />} />
          <Route
            path="cart"
            element={
              <RequireAuth>
                <CartPage products={products?.slice(0, 3)} />
              </RequireAuth>
            }
          />
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </DefaultLayout>
    </div>
  )
}

const RequireAuth = (props: PropsWithChildren) => {
  const user = useUserStore((state) => state.user)
  const location = useLocation()
  return user ? (
    props.children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  )
}

export default App
