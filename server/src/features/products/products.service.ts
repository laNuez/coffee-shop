import {
  deleteFromAllCarts,
  deleteProduct,
  softDeleteProduct,
  updateProduct
} from '@server/db/mutations'
import { getProductById, hasProductOrders } from '@server/db/queries'
import type { patchProduct, patchProductDB } from '@server/db/schema'
import { deleteImage, uploadImage } from './images.storage'
import { HTTPException } from 'hono/http-exception'

const update = async (id: string, data: patchProduct) => {
  const { image, ...rest } = data

  const oldProduct = await getProductById(id)
  if (!oldProduct) throw new HTTPException(404, { message: '404 Not found' })

  let newImageKey: string | undefined

  if (image) {
    newImageKey = await uploadImage(image)
    if (!newImageKey) throw Error('Image upload failed')
  }

  const p: patchProductDB = {
    ...rest,
    ...(newImageKey && { image: newImageKey })
  }

  let product: Awaited<ReturnType<typeof updateProduct>>

  try {
    product = await updateProduct(id, p)
  } catch (error) {
    if (newImageKey) await deleteImage(newImageKey)

    throw error
  }

  if (newImageKey) await deleteImage(oldProduct.image)

  return product
}

const remove = async (id: string) => {
  const row = await getProductById(id)
  if (!row) throw new HTTPException(404, { message: 'Not found' })

  const hasOrders = await hasProductOrders(id)

  if (hasOrders) {
    await softDeleteProduct(id)
  } else {
    await Promise.all([deleteProduct(id), deleteImage(row.image)])
  }

  await deleteFromAllCarts(id)
}

const productService = {
  update,
  remove
}

export default productService
