export type ApiResponse = {
  message: string;
  success: true;
}

export interface Product {
  id: number
  name: string
  price: number
  category: string
  description: string
}
