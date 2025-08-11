import { create } from 'zustand'
import { client } from '../lib/hono'
import { useCallback } from 'react'
import { AuthError } from '../util/util'

interface User {
  id: string
  email: string
  username: string
}

type State = {
  user: User | null
}

type Action = {
  setUser: (user: User) => void
  clearUser: () => void
  fetchUser: () => Promise<void>
}

export const useUserStore = create<State & Action>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  clearUser: () => set(() => ({ user: null })),
  fetchUser: async () => {
    let newState: State['user'] = null
    const res = await client.me.$get()
    if (!res.ok) throw new AuthError(res.statusText)
    const data = await res.json()
    newState = data

    return set(() => ({ user: newState }))
  },
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
    await client.logout.$get()
    clearUser()
  }
  return useCallback(fn, [clearUser])
}
