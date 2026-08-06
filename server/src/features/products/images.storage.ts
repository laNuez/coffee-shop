import { ACCEPTED_IMAGE_TYPES } from '@server/db/schema'
import { ENV } from '@server/env'
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'

const storage = new S3Client({
  region: 'auto',
  endpoint: ENV.BUCKET_ENDPOINT,
  credentials: {
    accessKeyId: ENV.BUCKET_ID,
    secretAccessKey: ENV.BUCKET_SECRET
  }
})

export const uploadImage = async (file: File): Promise<string> => {
  const contentType = ACCEPTED_IMAGE_TYPES.find((type) => file.type === type)

  if (!contentType) throw Error('Invalid image type')

  const key = `images/${crypto.randomUUID()}.${contentType.split('/')[1]}`

  const buffer = Buffer.from(await file.arrayBuffer())
  await storage.send(
    new PutObjectCommand({
      Bucket: ENV.BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType
    })
  )

  return key
}

export const deleteImage = async (key: string) => {
  await storage.send(
    new DeleteObjectCommand({
      Bucket: ENV.BUCKET_NAME,
      Key: key
    })
  )
}
