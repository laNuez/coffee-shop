import { eq } from "drizzle-orm"
import { db } from ".."
import { usersTable } from "./schema"

export const getUserByUsername = async (name: string) => {
  return await db.select().from(usersTable).where(eq(usersTable.username, name))
}
