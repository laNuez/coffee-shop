import {db} from '../index'
import { usersTable, type insertUser } from './schema'

export const createUser = async (data: insertUser) => {
  return await db.insert(usersTable).values(data)
}
