import { QueryClient, queryOptions } from '@tanstack/react-query'
import { getCategories, getHome, getProduct, getProducts } from '../lib/api'
import { LoaderFunctionArgs } from 'react-router'

export const homeQuery = queryOptions({
  queryKey: ['home'],
  queryFn: getHome
})

export const homeLoader = (queryClient: QueryClient) => async () => {
  return queryClient.ensureQueryData(homeQuery)
}

export const productQuery = (id: string) =>
  queryOptions({
    queryKey: ['products', id],
    queryFn: () => {
      return getProduct(id)
    }
  })

export const productLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    return await queryClient.ensureQueryData(productQuery(params.id!))
  }

export const productsQuery = (currentCategory: string | undefined) =>
  queryOptions({
    queryKey: ['products', currentCategory],
    queryFn: () => getProducts(currentCategory)
  })

export const categoriesQuery = queryOptions({
  queryKey: ['categories'],
  queryFn: getCategories
})

export const productsLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const searchParams = new URL(request.url).searchParams
    const category = searchParams.get('category')

    const products = await queryClient.ensureQueryData(
      productsQuery(category || undefined)
    )
    const categories = await queryClient.ensureQueryData(categoriesQuery)
    return { products, categories }
  }

export const adminProductsQuery = () =>
  queryOptions({
    queryKey: ['products', 'admin'],
    queryFn: () => getProducts()
  })

export const adminProductsLoader = (queryClient: QueryClient) => async () => {
  return await queryClient.ensureQueryData(adminProductsQuery())
}
