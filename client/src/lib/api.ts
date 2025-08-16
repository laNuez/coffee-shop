import { client } from "./hono"

export const getProducts = async () => {
  const res = await client.products.$get()
  if (!res.ok) throw await res.json()
  return await res.json()
}
