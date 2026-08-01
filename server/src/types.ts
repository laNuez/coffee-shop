import { getCartByUserId } from '@server/db/queries'

export interface UserFromToken {
  id: string
  username: string
  email: string
  exp: number
  role: string
}

export type UserWithCart = Awaited<ReturnType<typeof getCartByUserId>>

export type Variables = {
  Variables: {
    currentUser: null | UserFromToken
  }
}
