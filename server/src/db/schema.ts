import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

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

export type insertUser = typeof usersTable.$inferInsert
