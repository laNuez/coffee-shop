import { mockProducts } from '@server/mock'
import { db } from './client'
import { productsTable } from './schema'
import { productRequestToRecord } from '@server/tests/helpers'

await db.insert(productsTable).values(mockProducts.map(productRequestToRecord))
