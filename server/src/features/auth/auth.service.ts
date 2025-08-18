import { createUser } from '@server/db/mutations'
import { getUserByUsername } from '@server/db/queries'
import type { insertUser } from '@server/db/schema'
import { isUniqueConstraintError } from '@server/db/utils'
import { ENV } from '@server/env'
import bcrypt from 'bcrypt'
import { HTTPException } from 'hono/http-exception'
import { sign } from 'hono/jwt'
import z from 'zod'

export const loginSchema = z.object({
  username: z.string(),
  password: z.string()
})

const register = async (user: insertUser) => {
  const hashedPassword = await bcrypt.hash(user.password, 10)
  const userData = { ...user, password: hashedPassword }

  try {
    const user = await createUser(userData)
    return user
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new HTTPException(409, {
        message: 'Username or email already exists'
      })
    }
    throw error
  }
}

type LoginInput = z.infer<typeof loginSchema>
const login = async (credentials: LoginInput) => {
  const [row] = await getUserByUsername(credentials.username)
  if (!row)
    throw new HTTPException(401, { message: 'Invalid username or password' })

  const correct = await bcrypt.compare(credentials.password, row.password)
  if (!correct)
    throw new HTTPException(401, { message: 'Invalid username or password' })

  const { password, ...user } = row

  // expires in 60 minutes
  const exp = Math.floor(Date.now() / 1000) + 60 * 60
  const accessToken = await sign({ ...user, exp }, ENV.JWT_SECRET)
  return accessToken
}

const userService = {
  register,
  login
}

export default userService
