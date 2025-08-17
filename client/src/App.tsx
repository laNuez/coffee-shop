import { PropsWithChildren, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router'
import SignUpPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import DefaultLayout from './components/layout/DefaultLayout'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import { useFetchUser, useUserStore } from './stores/userStore'

function App() {
  const fetchUser = useFetchUser()
  const navigate = useNavigate()

  useEffect(() => {
    fetchUser().catch((error) => {
      console.error(error)
    })
  }, [fetchUser, navigate])

  return (
    <div>
      <DefaultLayout>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="register" element={<SignUpPage />} />
          <Route
            path="cart"
            element={
              <RequireAuth>
                <CartPage />
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
  if (user === undefined) return <div>fetching user</div> 
  return user ? (
    props.children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  )
}

export default App
