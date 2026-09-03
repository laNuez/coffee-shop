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
import { useUserStore } from './stores/userStore'
import { type Product } from 'shared'

const lazyRoute =
  (fn: () => Promise<{ default: ComponentType }>) => async () => {
    const { default: Component } = await fn()
    return { Component }
  }

export const router = createBrowserRouter([
  {
    path: '/',
    Component: DefaultLayout,
    loader: () => {
      useUserStore.getState().fetchUser()
    },
    children: [
      {
        errorElement: <RouteError />,
        children: [
          {
            index: true,
            loader: homeLoader(queryClient),
            lazy: lazyRoute(() => import('./pages/HomePage')),
            handle: { title: 'Home' }
          },
          {
            path: 'register',
            lazy: lazyRoute(() => import('./pages/RegisterPage')),
            handle: { title: 'Sign up' }
          },
          {
            path: 'cart',
            loader: cartLoader(queryClient),
            lazy: lazyRoute(() => import('./pages/CartPage')),
            handle: { title: 'Cart' }
          },
          {
            path: 'login',
            lazy: lazyRoute(() => import('./pages/LoginPage')),
            handle: { title: 'Login' }
          },
          {
            path: 'product/:id',
            loader: productLoader(queryClient),
            lazy: lazyRoute(() => import('./pages/ProductPage')),
            handle: {
              title: (data: Product | undefined) => data?.name
            }
          },
          {
            path: 'products',
            loader: productsLoader(queryClient),
            lazy: lazyRoute(() => import('./pages/ProductsPage')),
            handle: { title: 'Store' }
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
            },
            handle: { title: 'Orders' }
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
                element: <Navigate to="products" replace />
              },
              {
                path: 'products',
                loader: adminProductsLoader(queryClient),
                lazy: lazyRoute(
                  () => import('./pages/dashboard/DashboardProductsPage')
                ),
                handle: { title: 'Dashboard' }
              },
              {
                path: 'orders',
                loader: adminOrdersLoader(queryClient),
                lazy: lazyRoute(
                  () => import('./pages/dashboard/DashboardOrdersPage')
                ),
                handle: { title: 'Dashboard' }
              }
            ]
          },
          {
            path: '*',
            element: <NotFound />,
            handle: { title: 'Not Found' }
          }
        ]
      }
    ]
  }
])
