import { db } from '@server/db/client'
import { usersTable } from '@server/db/schema'
import { ENV } from '@server/env'
import { sign } from 'hono/jwt'

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
