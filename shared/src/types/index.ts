export type ApiResponse = {
  message: string
  success: boolean
}

export interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
}

export interface Token {
  accessToken: string
}

export interface LoginForm {
  username: string
  password: string
}

export type ProductForm = Omit<Product, 'id'>
export type ProductEdit = Partial<ProductForm>
