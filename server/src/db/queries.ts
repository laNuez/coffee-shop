import { eq } from "drizzle-orm"
import { db } from ".."
import { cartItemsTable, usersTable } from './schema'

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
