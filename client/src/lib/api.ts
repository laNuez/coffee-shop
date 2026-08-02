import { InferRequestType, InferResponseType } from 'hono'
import { client } from './hono'

const $getProducts = client.api.products.$get
export type ProductsResponse = InferResponseType<typeof $getProducts>
export const getProducts = async (category?: string) => {
  const res = await $getProducts({
    query: {
      category
    }
  })
  if (!res.ok) throw await res.json()
  return await res.json()
}

export const getProduct = async (id: string) => {
  const res = await client.api.products[':id'].$get({
    param: {
      id
    }
  })
  if (!res.ok) throw await res.json()
  return await res.json()
}

export const getCart = async () => {
  const res = await client.api.cart.$get()
  if (!res.ok) throw await res.json()
  return await res.json()
}

const $delCartItem = client.api.cart[':id'].$delete
export type DelCartItem = InferRequestType<typeof $delCartItem>['param']
export const delCartItem = async (args: DelCartItem) => {
  const res = await $delCartItem({
    param: {
      id: args.id
    }
  })
  if (!res.ok) throw await res.json()
}

const $addToCart = client.api.cart.$post
export type AddToCartInput = {
  productId: string
  quantity: number
}
export const addToCart = async (args: AddToCartInput) => {
  const res = await $addToCart({
    json: args
  })
  if (!res.ok) throw await res.json()
  return await res.json()
}

const $getCategories = client.api.categories.$get
export type CategoriesResponse = InferResponseType<typeof $getCategories>
export const getCategories = async () => {
  const res = await $getCategories()
  if (!res.ok) throw await res.json()
  return await res.json()
}

const $login = client.api.login.$post
export const login = async (username: string, password: string) => {
  const res = await $login({
    json: {
      username,
      password
    }
  })
  if (!res.ok) throw await res.json()
  return await res.json()
}

const $register = client.api.register.$post
export const register = async (
  username: string,
  email: string,
  password: string
) => {
  const res = await $register({
    json: {
      username,
      email,
      password
    }
  })
  if (!res.ok) throw await res.json()
  return await res.json()
}
