import { InferRequestType } from 'hono'
import { client } from './hono'

export const getProducts = async () => {
  const res = await client.products.$get()
  if (!res.ok) throw await res.json()
  return await res.json()
}

export const getProduct = async (id: string) => {
  const res = await client.products[':id'].$get({
    param: {
      id
    }
  })
  if (!res.ok) throw await res.json()
  return await res.json()
}

export const getCart = async () => {
  const res = await client.cart.$get()
  if (!res.ok) throw await res.json()
  return await res.json()
}

const $delCartItem = client.cart[':id'].$delete
export type DelCartItem = InferRequestType<typeof $delCartItem>['param']
export const delCartItem = async (args: DelCartItem) => {
  const res = await $delCartItem({
    param: {
      id: args.id
    }
  })
  if (!res.ok) throw await res.json()
}

const $addToCart = client.cart.$post
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
