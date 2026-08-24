import { relations, sql } from 'drizzle-orm'
import { int, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema
} from 'drizzle-zod'
import z from 'zod'
export const productsTable = sqliteTable('products_table', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  price: int().notNull(),
  category: text().notNull(),
  description: text().notNull(),
  image: text().notNull()
})

export const usersTable = sqliteTable('users_table', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: text().notNull().unique(),
  email: text().unique().notNull(),
  password: text().notNull(),
  role: text({
    enum: ['admin', 'user']
  })
    .default('user')
    .notNull()
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
  userId: text()
    .references(() => usersTable.id)
    .notNull(),
  totalAmount: int().notNull(),
  status: text({
    enum: [
      'pending',
      'paid',
      'preparing',
      'shipped',
      'delivered',
      'cancelled',
      'failed',
      'refunded'
    ]
  })
    .default('pending')
    .notNull(),
  createdAt: text()
    .default(sql`(current_timestamp)`)
    .notNull()
})

export const orderItemsTable = sqliteTable('order_items_table', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text()
    .references(() => ordersTable.id)
    .notNull(),
  productId: text()
    .references(() => productsTable.id)
    .notNull(),
  quantity: int().default(1).notNull(),
  price: int().notNull()
})

export const userSelectSchema = createSelectSchema(usersTable)
export const userInsertSchema = createInsertSchema(usersTable, {
  email: (schema) => schema.email().nonoptional(),
  username: (schema) => schema.min(4).max(12),
  password: (schema) => schema.min(6).max(100)
}).omit({
  id: true,
  role: true
})

const productInsertSchemaDB = createInsertSchema(productsTable, {
  category: (schema) => schema.min(3),
  price: (schema) => schema.int().min(100),
  description: (schema) => schema.min(3).max(3000),
  name: (schema) => schema.min(6),
  image: (schema) => schema.min(1)
}).omit({
  id: true
})

// https://stackoverflow.com/questions/72674930/zod-validator-validate-image
const MAX_FILE_SIZE = 5000000
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png'
] as const

export const productInsertSchema = productInsertSchemaDB.extend({
  price: z.coerce.number().int().min(100),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      // @ts-ignore
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, and .png formats are supported.'
    )
})

export const productUpdateSchema = productInsertSchema
  .partial()
  .refine((obj) => Object.keys(obj).length > 0, {
    error: 'Requires at least one valid field'
  })

export const productUpdateSchemaDB = productInsertSchema
  .extend({
    image: z.string().min(1)
  })
  .partial()

const cartItemInsertSchema = createInsertSchema(cartItemsTable).omit({
  id: true
})

export const addToCartRequestSchema = cartItemInsertSchema.omit({
  userId: true
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

const orderInsertSchema = createInsertSchema(ordersTable)

const orderUpdateSchema = createUpdateSchema(ordersTable)

export const orderUpdateRequestSchema = orderUpdateSchema.pick({
  status: true
})

const orderItemInsertSchema = createInsertSchema(orderItemsTable)
const orderItemUpdateSchema = createUpdateSchema(orderItemsTable)

export type updateCartItem = z.infer<typeof cartItemPatchSchema>

export type InsertCartParams = z.infer<typeof cartItemInsertSchema>

export type insertProduct = z.infer<typeof productInsertSchemaDB>

export type formProduct = z.infer<typeof productInsertSchema>

export type patchProduct = z.infer<typeof productUpdateSchema>

export type patchProductDB = z.infer<typeof productUpdateSchemaDB>

export type insertUser = z.infer<typeof userInsertSchema>

export type insertOrder = z.infer<typeof orderInsertSchema>

export type updateOrder = z.infer<typeof orderUpdateSchema>

export type insertOrderItem = z.infer<typeof orderItemInsertSchema>

export type updateOrderItem = z.infer<typeof orderItemUpdateSchema>

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

export const orderItemRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.orderId],
    references: [ordersTable.id]
  }),
  product: one(productsTable, {
    fields: [orderItemsTable.productId],
    references: [productsTable.id]
  })
}))

export const orderRelations = relations(ordersTable, ({ many, one }) => ({
  items: many(orderItemsTable),
  customer: one(usersTable, {
    fields: [ordersTable.userId],
    references: [usersTable.id]
  })
}))
