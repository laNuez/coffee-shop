import { and, eq } from 'drizzle-orm'
import { db } from './client'
import {
  cartItemsTable,
  orderItemsTable,
  ordersTable,
  productsTable,
  usersTable,
  type insertCartItem,
  type insertOrder,
  type insertOrderItem,
  type insertProduct,
  type insertUser,
  type patchProductDB,
  type updateCartItem as updateCartItemType,
  type updateOrderItem as updateOrderItemType,
  type updateOrder as updateOrderType
} from './schema'

export const createUser = async (data: insertUser) => {
  const [row] = await db.insert(usersTable).values(data).returning({
    id: usersTable.id,
    username: usersTable.username,
    email: usersTable.email
  })
  if (!row) {
    throw new Error('Failed to add item or retrieve item')
  }
  return row
}

export const createProduct = async (data: insertProduct) => {
  return await db.insert(productsTable).values(data).returning()
}

export const deleteProduct = async (id: string) => {
  return db.delete(productsTable).where(eq(productsTable.id, id))
}

export const updateProduct = async (id: string, data: patchProductDB) => {
  const [row] = await db
    .update(productsTable)
    .set(data)
    .where(eq(productsTable.id, id))
    .returning()
  if (!row) throw new Error('Failed to update or retrieve product')

  return row
}

export const addToCart = async (data: insertCartItem) => {
  const [row] = await db.insert(cartItemsTable).values(data).returning()
  if (!row) {
    throw new Error('Failed to add item or retrieve item')
  }
  return row
}

export const deleteFromCart = async (userId: string, id: string) => {
  return await db
    .delete(cartItemsTable)
    .where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.id, id)))
}

export const deleteUserCart = async (userId: string) => {
  return await db
    .delete(cartItemsTable)
    .where(eq(cartItemsTable.userId, userId))
}

export const updateCartItem = async (id: string, data: updateCartItemType) => {
  const [row] = await db
    .update(cartItemsTable)
    .set(data)
    .where(eq(cartItemsTable.id, id))
    .returning()

  if (!row) {
    throw new Error('Failed to update or retrieve item')
  }
  return row
}

export const createOrder = async (data: insertOrder) => {
  const [row] = await db.insert(ordersTable).values(data).returning()

  if (!row) {
    throw new Error('Failed to add order')
  }

  return row
}

export const updateOrderById = async (id: string, data: updateOrderType) => {
  const [row] = await db.update(ordersTable).set(data).returning()

  if (!row) {
    throw new Error('Failed to update order')
  }

  return row
}

export const createOrderItem = async (
  data: insertOrderItem | insertOrderItem[]
) => {
  const [row] = await db
    .insert(orderItemsTable)
    .values(Array.isArray(data) ? data : [data])
    .returning()

  if (!row) {
    throw new Error('Failed to add order item')
  }

  return row
}

export const updateOrderItem = async (data: updateOrderItemType) => {
  const [row] = await db.update(orderItemsTable).set(data).returning()

  if (!row) {
    throw new Error('Failed to update order item')
  }

  return row
}
