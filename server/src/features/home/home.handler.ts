import { Hono } from 'hono'
import { getHomeRecommendations } from './home.service'

const app = new Hono().get('/', async (c) => {
  const home = await getHomeRecommendations()
  return c.json(home, 200)
})

export default app
