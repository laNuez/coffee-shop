import { create } from 'zustand'
import { client } from '../lib/hono'
import { useCallback } from 'react'

interface User {
  id: string
  email: string
  username: string
  role: string
}

type State = {
  user: User | null | undefined
}

type Action = {
  setUser: (user: User) => void
  clearUser: () => void
  fetchUser: () => Promise<void>
}

export const useUserStore = create<State & Action>((set) => ({
  user: undefined,
  setUser: (user) => set(() => ({ user })),
  clearUser: () => set(() => ({ user: null })),
  fetchUser: async () => {
    const res = await client.api.me.$get()
    if (!res.ok) {
      return set(() => ({ user: null }))
    }
    const data = await res.json()

    return set(() => ({ user: data }))
  }
}))

export const useFetchUser = () => {
  const fetchUser = useUserStore((state) => state.fetchUser)
  const fn = async () => {
    return fetchUser()
  }

  return useCallback(fn, [fetchUser])
}

export const useLogout = () => {
  const clearUser = useUserStore((state) => state.clearUser)

  const fn = async () => {
    await client.api.logout.$get()
    clearUser()
  }
  return useCallback(fn, [clearUser])
}
