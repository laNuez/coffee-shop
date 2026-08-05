import type { CreateProductRequest } from 'shared/dist'

export const mockProducts: CreateProductRequest<string>[] = [
  {
    name: 'Ethiopian Yirgacheffe',
    price: '1599',
    category: 'Beans',
    description:
      'Floral and citrusy single-origin beans from Ethiopia, ideal for pour-over methods.',
    image: 'https://placehold.co/600x400'
  },
  {
    name: 'Colombian Supremo',
    price: '1399',
    category: 'Beans',
    description:
      'Smooth, well-balanced medium roast with notes of chocolate and nuts.',
    image: 'https://placehold.co/600x400'
  },
  {
    name: 'Espresso Blend',
    price: '1499',
    category: 'Beans',
    description:
      'Dark roasted beans with deep caramel and chocolate notes. Perfect for espresso machines.',
    image: 'https://placehold.co/600x400'
  },
  {
    name: 'Instant Coffee - House Blend',
    price: '899',
    category: 'Instant',
    description:
      'Fast and flavorful. Our house blend in instant form for convenience without compromise.',
    image: 'https://placehold.co/600x400'
  },
  {
    name: 'French Press Set',
    price: '2499',
    category: 'Gear',
    description:
      'Complete French press set including 350ml brewer and stainless steel scoop.',
    image: 'https://placehold.co/600x400'
  },
  {
    name: 'Kenya AA',
    price: '1699',
    category: 'Beans',
    description:
      'Bright and winey, this high-grade Kenyan coffee has a bold, fruity flavor profile.',
    image: 'https://placehold.co/600x400'
  },
  {
    name: 'Reusable Coffee Filter',
    price: '699',
    category: 'Gear',
    description:
      'Eco-friendly stainless steel coffee filter compatible with most drip brewers.',
    image: 'https://placehold.co/600x400'
  },
  {
    name: 'Café Mocha Kit',
    price: '1999',
    category: 'Kits',
    description:
      'DIY mocha kit with premium cocoa, espresso beans, and milk frothing guide.',
    image: 'https://placehold.co/600x400'
  },
  {
    name: 'Guatemalan Antigua',
    price: '1499',
    category: 'Beans',
    description:
      'Rich and velvety beans with notes of chocolate and spice from the Antigua region.',
    image: 'https://placehold.co/600x400'
  },
  {
    name: 'Coffee Grinder - Manual',
    price: '1899',
    category: 'Gear',
    description:
      'Adjustable burr grinder with ceramic blades for precise and consistent grinding.',
    image: 'https://placehold.co/600x400'
  }
]
