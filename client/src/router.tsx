import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router'
import DefaultLayout from './components/layout/DefaultLayout'
import CartPage, { loader as cartLoader } from './pages/CartPage'
import HomePage, { loader as homepageLoader } from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductPage, { loader as productLoader } from './pages/ProductPage'
import ProductsPage, { loader as productsLoader } from './pages/ProductsPage'
import SignUpPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import OrdersPage, { loader as ordersLoader } from './pages/OrdersPage'
import { RequireAuth } from './components/RequireAuth'
import { queryClient } from './lib/query'
import { RequireAdmin } from './components/RequireAdmin'
import { RouteError } from './components/RouteError'
import NotFound from './pages/NotFoundPage'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<DefaultLayout />}>
      <Route errorElement={<RouteError />}>
        <Route
          index
          element={<HomePage />}
          loader={homepageLoader(queryClient)}
        />
        <Route path="register" element={<SignUpPage />} />
        <Route
          path="cart"
          element={
            <RequireAuth>
              <CartPage />
            </RequireAuth>
          }
          loader={cartLoader(queryClient)}
        />
        <Route path="login" element={<LoginPage />} />
        <Route
          path="product/:id"
          element={<ProductPage />}
          loader={productLoader(queryClient)}
        />
        <Route
          path="products"
          element={<ProductsPage />}
          loader={productsLoader(queryClient)}
        />
        <Route
          path="orders"
          element={<OrdersPage />}
          loader={ordersLoader(queryClient)}
        />
        <Route
          path="admin/dashboard"
          element={
            <RequireAdmin>
              <DashboardPage />
            </RequireAdmin>
          }
          loader={productsLoader(queryClient)}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Route>
  )
)
