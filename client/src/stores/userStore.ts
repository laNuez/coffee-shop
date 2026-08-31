import { create } from 'zustand'
import { client } from '../lib/hono'
import { useCallback } from 'react'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { THEMES } from '../util/constants'

interface User {
  id: string
  email: string
  username: string
  role: string
}

type State = {
  user: User | null | undefined
  theme: (typeof THEMES)[number]
}

type Action = {
  setUser: (user: User) => void
  clearUser: () => void
  fetchUser: () => Promise<void>
  setTheme: (theme: State['theme']) => void
}

export const useUserStore = create<State & Action>()(
  subscribeWithSelector(
    persist(
      (set) => ({
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
        },
        theme: 'light',
        setTheme: (theme) => {
          return set(() => ({ theme }))
        }
      }),
      {
        name: import.meta.env.VITE_APP_NAME,
        partialize: (state) => ({ theme: state.theme }),
        onRehydrateStorage: () => (state) => {
          if (state)
            document.documentElement.setAttribute('data-theme', state.theme)
        }
      }
    )
  )
)

export const useFetchUser = () => {
  const fetchUser = useUserStore((state) => state.fetchUser)

  return useCallback(async () => {
    return fetchUser()
  }, [fetchUser])
}

export const useLogout = () => {
  const clearUser = useUserStore((state) => state.clearUser)

  return useCallback(async () => {
    await client.api.logout.$post()
    clearUser()
  }, [clearUser])
}

useUserStore.subscribe(
  (state) => state.theme,
  (state) => document.documentElement.setAttribute('data-theme', state)
)
