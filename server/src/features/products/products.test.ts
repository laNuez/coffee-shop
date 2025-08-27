import { db } from '@server/db/client'
import { productsTable } from '@server/db/schema'
import app from '@server/index'
import { mockProducts } from '@server/mock'
import { beforeEach, describe, expect, it, mock, test } from 'bun:test'
import { testClient } from 'hono/testing'

const client = testClient(app)

describe('Products API', () => {
  let ValidProductId: string
  beforeEach(async () => {
    await db.delete(productsTable)
    const result = await db
      .insert(productsTable)
      .values(mockProducts)
      .returning()
    ValidProductId = result[0]!.id
  })

  describe('GET /', () => {
    it('should returns all products', async () => {
      const res = await client.products.$get()
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data.length).toBe(mockProducts.length)
    })

    it('should return products matching the Beans category', async () => {
      const category = 'Beans'
      const res = await client.products.$get({
        query: {
          category
        }
      })
      const data = await res.json()
      const filtered = mockProducts.filter((p) => p.category === category)

      expect(res.status).toBe(200)
      expect(data.length).toBe(filtered.length)
      data.forEach((p) => expect(p.category).toBe(category))
    })

    it('should return an empty array if the category doesnt match', async () => {
      const res = await client.products.$get({
        query: {
          category: 'beep'
        }
      })
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data.length).toBe(0)
    })
  })

  describe('GET /:id', () => {
    it('should return a product if the id is valid', async () => {
      const res = await client.products[':id'].$get({
        param: {
          id: ValidProductId
        }
      })
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data.id).toBe(ValidProductId)
    })

    it('should return 404 if the id is invalid', async () => {
      const res = await client.products[':id'].$get({
        param: {
          id: crypto.randomUUID()
        }
      })

      expect(res.status).toBe(404)
    })
  })

  describe('POST /', () => {
    it('should return a 201 and the product if the body is valid', async () => {
      const mock = mockProducts[0]!
      const res = await client.products.$post({
        json: mock
      })
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()

      expect(res.status).toBe(201)
      expect(data.name).toBe(mock.name)
      expect(data.id).toBeString()
    })

    it('should return a 400 when the price is missing', async () => {
      const { price, ...mock } = mockProducts[0]!
      const res = await client.products.$post({
        json: mock
      })

      expect(res.status).toBe(400)
    })
  })

  describe('DELETE /:id', () => {
    it('should return a 204 status code', async () => {
      const res = await client.products[':id'].$delete({
        param: {
          id: ValidProductId
        }
      })
      expect(res.status).toBe(204)
    })

    it('should return a 404 status code when trying to delete the same product twice', async () => {
      const _res = await client.products[':id'].$delete({
        param: {
          id: ValidProductId
        }
      })
      expect(_res.status).toBe(204)

      const res = await client.products[':id'].$delete({
        param: {
          id: ValidProductId
        }
      })

      expect(res.status).toBe(404)
    })
  })
})
