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

// TODO: delete images if something fails

const update = async (id: string, data: patchProduct) => {
  const toUpload = (file: File | undefined): file is File => Boolean(file)

  const { image, ...rest } = data

  const oldProduct = await getProductById(id)
  if (!oldProduct) throw new HTTPException(404, { message: '404 Not found' })

  const imageKey = oldProduct.image
  let newImageKey: string | undefined

  if (toUpload(data.image)) {
    newImageKey = await uploadImage(data.image)
    if (!newImageKey) throw Error('Image upload failed')
  }

  const p: patchProductDB = {
    ...rest,
    ...(image && { image: newImageKey })
  }

  const product = await updateProduct(id, p)

  if (imageKey && newImageKey) {
    await deleteImage(imageKey)
  }

  return product
}

const remove = async (id: string) => {
  const row = await getProductById(id)
  if (!row) throw new HTTPException(404, { message: 'Not found' })

  const hasOrders = await hasProductOrders(id)

  if (hasOrders) {
    await softDeleteProduct(id)
  } else {
    await Promise.all([await deleteProduct(id), await deleteImage(row.image)])
  }

  await deleteFromAllCarts(id)
}

const productService = {
  update,
  remove
}

export default productService
