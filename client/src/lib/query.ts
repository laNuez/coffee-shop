import { QueryClient } from '@tanstack/react-query'
import { NotFoundError, UnauthorizedError } from '../util/util'

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      throwOnError(error) {
        return (
          error instanceof UnauthorizedError || error instanceof NotFoundError
        )
      }
    }
  }
})
