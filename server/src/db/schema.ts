import { relations, sql } from 'drizzle-orm'
import { int, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema
} from 'drizzle-zod'
import type z from 'zod'
export const productsTable = sqliteTable('products_table', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  price: int().notNull(),
  category: text().notNull(),
  description: text().notNull()
})

export const usersTable = sqliteTable('users_table', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: text().notNull().unique(),
  email: text().unique().notNull(),
  password: text().notNull()
})

export const cartItemsTable = sqliteTable(
  'cart_items_table',
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text()
      .references(() => usersTable.id)
      .notNull(),
    productId: text()
      .references(() => productsTable.id, {
        onDelete: 'cascade'
      })
      .notNull(),
    quantity: int().notNull().default(1)
  },
  (t) => [unique().on(t.userId, t.productId)]
)

export const ordersTable = sqliteTable('orders_table', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text().references(() => usersTable.id),
  totalAmount: int().notNull(),
  status: text({
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  }).default('pending'),
  createdAt: text().default(sql`(current_timestamp)`)
})

export const orderItemsTable = sqliteTable('order_items_table', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text().references(() => ordersTable.id),
  productId: text().references(() => productsTable.id),
  quantity: int().default(1),
  price: int().notNull()
})

export const userSelectSchema = createSelectSchema(usersTable)
export const userInsertSchema = createInsertSchema(usersTable, {
  email: (schema) => schema.email().nonoptional(),
  username: (schema) => schema.min(4).max(12),
  password: (schema) => schema.min(6).max(100)
}).omit({
  id: true
})

export const productInsertSchema = createInsertSchema(productsTable, {
  category: (schema) => schema.min(3),
  price: (schema) => schema.min(100),
  description: (schema) => schema.min(3).max(3000),
  name: (schema) => schema.min(6)
}).omit({
  id: true
})

export const cartItemInsertSchema = createInsertSchema(cartItemsTable).omit({
  id: true
})

export const cartItemPatchSchema = createUpdateSchema(cartItemsTable, {
  quantity: (schema) => schema.min(1)
})
  .pick({
    quantity: true
  })
  .required({
    quantity: true
  })

export type updateCartItem = z.infer<typeof cartItemPatchSchema>

export type insertCartItem = z.infer<typeof cartItemInsertSchema>

export type insertProduct = z.infer<typeof productInsertSchema>

export type insertUser = z.infer<typeof userInsertSchema>

export const cartItemsRelations = relations(cartItemsTable, ({ one }) => ({
  customer: one(usersTable, {
    fields: [cartItemsTable.userId],
    references: [usersTable.id]
  }),
  product: one(productsTable, {
    fields: [cartItemsTable.productId],
    references: [productsTable.id]
  })
}))

export const usersRelations = relations(usersTable, ({ many }) => ({
  cart: many(cartItemsTable)
}))
