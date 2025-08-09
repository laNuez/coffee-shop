export type ApiResponse = {
  message: string
  success: boolean
}

export interface Product {
  id: number
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
