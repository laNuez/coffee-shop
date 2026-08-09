import { deleteUserCart } from '@server/db/mutations'

const clear = async (userId: string) => {
  await deleteUserCart(userId)
}

const cartService = {
  clear
}

export default cartService
