import { PanelLeftIcon } from 'lucide-react'
import { Drawer } from '../components/Drawer'
import { Link, Outlet } from 'react-router'

const DashboardPage = () => {
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
      <div className="bg-base-200 flex h-14 min-w-full items-center p-2 lg:hidden">
        <label htmlFor="dashboard-drawer" className="btn drawer-button">
          <PanelLeftIcon />
        </label>
      </div>
      {/* <div className="m-8 mt-2"> */}
      <Outlet />
      {/* </div> */}
    </Drawer>
  )
}

export default DashboardPage
