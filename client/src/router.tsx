import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router'
import DefaultLayout from './components/layout/DefaultLayout'
import CartPage from './pages/CartPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductPage, { loader as productLoader } from './pages/ProductPage'
import ProductsPage from './pages/ProductsPage'
import SignUpPage from './pages/RegisterPage'
import { RequireAuth } from './components/RequireAuth'
import { queryClient } from './lib/query'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<DefaultLayout />}>
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
      <Route
        path="product/:id"
        element={<ProductPage />}
        loader={productLoader(queryClient)}
      />
      <Route path="products" element={<ProductsPage />} />
    </Route>
  )
)
