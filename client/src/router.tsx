import { createBrowserRouter, Navigate } from 'react-router'
import DefaultLayout from './components/layout/DefaultLayout'
import { RequireAuth } from './components/RequireAuth'
import { RequireAdmin } from './components/RequireAdmin'
import { RouteError } from './components/RouteError'
import NotFound from './pages/NotFoundPage'
import { queryClient } from './lib/query'
import { cartLoader } from './routes/cart'
import {
  adminProductsLoader,
  homeLoader,
  productLoader,
  productsLoader
} from './routes/products'
import { adminOrdersLoader, ordersLoader } from './routes/orders'
import { ComponentType } from 'react'

const lazyRoute =
  (fn: () => Promise<{ default: ComponentType }>) => async () => {
    const { default: Component } = await fn()
    return { Component }
  }

export const router = createBrowserRouter([
  {
    path: '/',
    Component: DefaultLayout,
    children: [
      {
        errorElement: <RouteError />,
        children: [
          {
            index: true,
            loader: homeLoader(queryClient),
            lazy: lazyRoute(() => import('./pages/HomePage'))
          },
          {
            path: 'register',
            lazy: async () => {
              const { default: SignUpPage } = await import(
                './pages/RegisterPage'
              )
              return { Component: SignUpPage }
            }
          },
          {
            path: 'cart',
            loader: cartLoader(queryClient),
            lazy: lazyRoute(() => import('./pages/CartPage'))
          },
          {
            path: 'login',
            lazy: lazyRoute(() => import('./pages/LoginPage'))
          },
          {
            path: 'product/:id',
            loader: productLoader(queryClient),
            lazy: lazyRoute(() => import('./pages/ProductPage'))
          },
          {
            path: 'products',
            loader: productsLoader(queryClient),
            lazy: lazyRoute(() => import('./pages/ProductsPage'))
          },
          {
            path: 'orders',
            loader: ordersLoader(queryClient),
            lazy: async () => {
              const { default: OrdersPage } = await import('./pages/OrdersPage')
              return {
                Component: () => (
                  <RequireAuth>
                    <OrdersPage />
                  </RequireAuth>
                )
              }
            }
          },
          {
            path: 'admin/dashboard',
            lazy: async () => {
              const { default: DashboardPage } = await import(
                './pages/DashboardPage'
              )
              return {
                Component: () => (
                  <RequireAdmin>
                    <DashboardPage />
                  </RequireAdmin>
                )
              }
            },
            children: [
              {
                index: true,
                element: <Navigate to="products" />
              },
              {
                path: 'products',
                loader: adminProductsLoader(queryClient),
                lazy: lazyRoute(
                  () => import('./pages/dashboard/DashboardProductsPage')
                )
              },
              {
                path: 'orders',
                loader: adminOrdersLoader(queryClient),
                lazy: lazyRoute(
                  () => import('./pages/dashboard/DashboardOrdersPage')
                )
              }
            ]
          },
          {
            path: '*',
            element: <NotFound />
          }
        ]
      }
    ]
  }
])
