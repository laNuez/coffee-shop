import type { Product } from 'shared/dist'
import {
  getFeaturedProducts,
  getPopularProducts
} from '../products/products.repository'

interface Home {
  featured: Product[]
  popular: Product[]
}

export const getHomeRecommendations = async (): Promise<Home> => {
  const [featured, popular] = await Promise.all([
    getFeaturedProducts(),
    getPopularProducts()
  ])

  return {
    featured,
    popular
  }
}
