import { ACCEPTED_IMAGE_TYPES } from '@server/db/schema'
import { ENV } from '@server/env'
import { S3Client } from 'bun'

const storage = new S3Client({
  region: 'auto',
  endpoint: ENV.BUCKET_ENDPOINT,
  bucket: ENV.BUCKET_NAME,
  accessKeyId: ENV.BUCKET_ID,
  secretAccessKey: ENV.BUCKET_SECRET
})

export const uploadImage = async (file: File): Promise<string> => {
  const contentType = ACCEPTED_IMAGE_TYPES.find((type) => file.type === type)

  if (!contentType) throw Error('Invalid image type')

  const key = `images/${crypto.randomUUID()}.${contentType.split('/')[1]}`

  await storage.write(key, file, {
    type: contentType
  })

  return key
}

export const deleteImage = async (key: string) => {
  await storage.delete(key)
}
