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
    <>
      <Header />
      <div>{<Outlet />}</div>
    </>
  )
}

export default DefaultLayout
