import { and, eq } from 'drizzle-orm'
import { db } from './client'
import {
  cartItemsTable,
  productsTable,
  usersTable,
  type insertCartItem,
  type insertProduct,
  type insertUser,
  type patchProduct,
  type updateCartItem as updateCartItemType
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

export const updateProduct = async (id: string, data: patchProduct) => {
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
