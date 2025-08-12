import { eq } from 'drizzle-orm'
import { db } from './client'
import {
  productsTable,
  usersTable,
  type insertProduct,
  type insertUser,
} from './schema'

export const createUser = async (data: insertUser) => {
  return await db.insert(usersTable).values(data).returning()
}

export const createProduct = async (data: insertProduct) => {
  return await db.insert(productsTable).values(data).returning()
}

export const deleteProduct = async (id: string) => {
  return db.delete(productsTable).where(eq(productsTable.id, id))
}
