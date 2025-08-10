import { eq } from "drizzle-orm"
import { db } from ".."
import { cartItemsTable, productsTable, usersTable } from './schema'

export const getUserByUsername = async (name: string) => {
  return await db.select().from(usersTable).where(eq(usersTable.username, name))
}

export const getCartByUserId = async (id: string) => {
  const cart = await db.query.cartItemsTable.findMany({
    where: eq(cartItemsTable.userId, id),
    with: {
      product: true
    },
  })
  if (!cart) return null
  return cart
}

export const getProducts = async () => {
  return await db.query.productsTable.findMany()
}

export const getProductById = async (id: string) => {
  return await db.query.productsTable.findFirst({
    where: eq(productsTable.id, id),
  })
}
