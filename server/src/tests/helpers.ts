import { db } from '@server/db/client'
import { usersTable } from '@server/db/schema'
import { ENV } from '@server/env'
import productService from '@server/features/products/products.service'
import { mockProducts } from '@server/mock'
import { file } from 'bun'
import { sign } from 'hono/jwt'
import type { CreateProductRequest } from 'shared'

export const createTestAdmin = async () => {
  const [row] = await db
    .insert(usersTable)
    .values({
      email: 'test@admin.com',
      password: 'adminadmin',
      username: 'admin',
      role: 'admin'
    })
    .returning({
      id: usersTable.id,
      username: usersTable.username,
      email: usersTable.email,
      role: usersTable.role
    })

  const exp = Math.floor(Date.now() / 1000) + 60 * 60
  const accessToken = await sign({ ...row, exp }, ENV.JWT_SECRET)

  const cookie_string = `access_token=${accessToken}`
  return cookie_string
}

export const getProductWithImage = (): CreateProductRequest<File> => {
  const image = new File(['image'], 'test.png', { type: 'image/png' })

  const mock = mockProducts[0]!
  return {
    ...mock,
    image
  }
}

export const parseMock = <T>(mock: CreateProductRequest<T>) => {
  return {
    ...mock,
    price: mock.price.toString()
  }
}

export const productRequestToRecord = <T>(mock: CreateProductRequest<T>) => {
  return {
    ...mock,
    price: Number(mock.price)
  }
}
