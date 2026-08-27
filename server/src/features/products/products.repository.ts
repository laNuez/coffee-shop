import { db } from '@server/db/client'
import { orderItemsTable, ordersTable, productsTable } from '@server/db/schema'
import {
  and,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNull,
  sql
} from 'drizzle-orm'

const successfulStatuses = [
  'paid',
  'preparing',
  'shipped',
  'delivered'
] as const

export const getPopularProducts = async () => {
  return await db
    .select(getTableColumns(productsTable))
    .from(productsTable)
    .innerJoin(orderItemsTable, eq(orderItemsTable.productId, productsTable.id))
    .innerJoin(ordersTable, eq(ordersTable.id, orderItemsTable.orderId))
    .where(
      and(
        isNull(productsTable.deletedAt),
        inArray(ordersTable.status, successfulStatuses)
      )
    )
    .groupBy(productsTable.id)
    .orderBy(desc(sql`sum(${orderItemsTable.quantity})`))
    .limit(6)
}

export const getFeaturedProducts = async () => {
  return await db.query.productsTable.findMany({
    limit: 6,
    where: and(
      eq(productsTable.category, 'Beans'),
      isNull(productsTable.deletedAt)
    )
  })
}
