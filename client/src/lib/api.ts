import { InferRequestType } from 'hono'
import { client } from './hono'
import { CreateProductRequest, UpdateProductRequest } from 'shared'
import { InferSuccessResponseType } from '../util/util'

const $getProducts = client.api.products.$get
export type ProductsResponse = InferSuccessResponseType<typeof $getProducts>
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

export const deleteProduct = async (id: string) => {
  const res = await client.api.products[':id'].$delete({ param: { id } })
  if (!res.ok) throw await res.json()
  return res
}

export const addProduct = async (args: CreateProductRequest<File>) => {
  const res = await client.api.products.$post({
    form: args
  })
  if (!res.ok) throw await res.json()
  return await res.json()
}

export const editProduct = async (
  id: string,
  args: UpdateProductRequest<File>
) => {
  const res = await client.api.products[':id'].$patch({
    form: args,
    param: {
      id
    }
  })
  if (!res.ok) throw await res.json()
  return res.json()
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
export type CategoriesResponse = InferSuccessResponseType<typeof $getCategories>
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
  return res
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

export const checkout = async () => {
  const res = await client.api.orders['checkout'].$post()
  if (!res.ok) throw await res.json()
  return await res.json()
}

const $getOrders = client.api.orders.$get
export type Orders = InferSuccessResponseType<typeof $getOrders>
export type Order = Orders[number]
export const getOrders = async () => {
  const res = await $getOrders()
  if (!res.ok) throw await res.json()
  return await res.json()
}

export const getOrdersAdmin = async () => {
  const res = await client.api.orders.admin.$get()
  if (!res.ok) throw await res.json()
  return await res.json()
}

const $updateOrder = client.api.orders[':id'].$patch
export type OrderRequest = InferRequestType<typeof $updateOrder>['json']
export const updateOrder = async (id: string, data: OrderRequest) => {
  const res = await $updateOrder({
    param: {
      id
    },
    json: data
  })
  if (!res.ok) throw await res.json()
  return await res.json()
}
