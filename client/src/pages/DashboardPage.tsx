import { PanelLeftIcon } from 'lucide-react'
import { Drawer } from '../components/Drawer'
import { Link, Outlet } from 'react-router'
import { useUserStore } from '../stores/userStore'

const DashboardPage = () => {
  const user = useUserStore((state) => state.user)
  const isDemoAdmin = user?.role === 'admin_demo'
  return (
    <Drawer
      id="dashboard-drawer"
      sidebar={
        <aside className="bg-base-100 min-h-full w-64 pt-4">
          <ul className="menu">
            <li className="menu-title">Manage</li>
            <li>
              <Link to="products">Products</Link>
            </li>
            <li>
              <Link to="orders">Orders</Link>
            </li>
          </ul>
        </aside>
      }
    >
      <div className="bg-base-200 flex h-14 min-w-full items-center gap-4 p-2 lg:hidden">
        <label htmlFor="dashboard-drawer" className="btn drawer-button">
          <PanelLeftIcon />
        </label>
        {isDemoAdmin && (
          <div className="alert alert-warning mx-auto font-semibold">
            Read-only admin account
          </div>
        )}
      </div>
      {isDemoAdmin && (
        <div className="alert alert-warning mt-2 hidden font-semibold lg:block">
          Read-only admin account
        </div>
      )}
      <Outlet />
    </Drawer>
  )
}

export default DashboardPage
