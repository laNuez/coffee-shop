import { Header } from './Header'
import { Outlet, ScrollRestoration } from 'react-router'

const DefaultLayout = () => {
  return (
    <div className="flex h-dvh flex-col">
      <Header />
      <div className="flex-1">{<Outlet />}</div>
      <ScrollRestoration />
    </div>
  )
}

export default DefaultLayout
