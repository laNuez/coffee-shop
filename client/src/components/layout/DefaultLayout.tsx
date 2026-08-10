import { useEffect } from 'react'
import { useFetchUser } from '../../stores/userStore'
import { Header } from './Header'
import { Outlet } from 'react-router'

const DefaultLayout = () => {
  const fetchUser = useFetchUser()

  useEffect(() => {
    fetchUser().catch((error) => {
      console.error(error)
    })
  }, [fetchUser])
  return (
    <div className="flex h-dvh flex-col">
      <Header />
      <div className="flex-1">{<Outlet />}</div>
    </div>
  )
}

export default DefaultLayout
