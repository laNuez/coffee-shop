import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCartItem } from '../lib/api'
import { cartQuery } from '../routes/cart'

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (args: {
      id: string
      quantity: number
      optimistic?: boolean
    }) => updateCartItem(args.id, { quantity: args.quantity }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: cartQuery.queryKey })

      const previousCart = queryClient.getQueryData(cartQuery.queryKey)

      if (variables.optimistic) {
        queryClient.setQueryData(cartQuery.queryKey, (prev) =>
          prev?.map((item) =>
            item.id === variables.id
              ? {
                  ...item,
                  quantity: variables.quantity
                }
              : item
          )
        )
      }

      return { previousCart }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartQuery.queryKey, context.previousCart)
      }
      queryClient.invalidateQueries({ queryKey: cartQuery.queryKey })
    }
  })
}
