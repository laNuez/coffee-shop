import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type z from 'zod'
export const productsTable = sqliteTable('products_table', {
  id: int().primaryKey(),
  name: text().notNull(),
  price: int().notNull(),
  category: text().notNull(),
  description: text().notNull(),
})

export const usersTable = sqliteTable('users_table', {
  id: int().primaryKey(),
  username: text().notNull().unique(),
  email: text().unique().notNull(),
  password: text().notNull(),
})

export const userSelectSchema = createSelectSchema(usersTable)
export const userInsertSchema = createInsertSchema(usersTable, {
  email: (schema) => schema.email(),
  username: (schema) => schema.min(4).max(12),
  password: (schema) => schema.min(6).max(100)
}).omit({
  id: true,
})

export type insertUser = z.infer<typeof userInsertSchema>
