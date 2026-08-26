import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useLogout, useUserStore } from '../../stores/userStore'
import { Menu } from 'lucide-react'

const THEMES = ['light', 'dark'] as const
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isValidTheme = (theme: any): theme is Theme => {
  return THEMES.includes(theme)
}
type Theme = (typeof THEMES)[number]
export const Header = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const theme = localStorage.getItem('theme')
    return isValidTheme(theme) ? theme : THEMES[0]
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const user = useUserStore((state) => state.user)
  const logout = useLogout()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <Menu />
          </div>
          <ul
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            tabIndex={0}
          >
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/products">Products</NavLink>
            </li>
            {(user?.role === 'admin' || user?.role === 'admin_demo') && (
              <li>
                <NavLink to="admin/dashboard">Dashboard</NavLink>
              </li>
            )}
          </ul>
        </div>
        <div className="hidden lg:flex">
          <NavLink className="btn btn-ghost" to="/">
            Home
          </NavLink>
          <NavLink className="btn btn-ghost" to="/products">
            Products
          </NavLink>
          {(user?.role === 'admin' || user?.role === 'admin_demo') && (
            <NavLink className="btn btn-ghost" to="admin/dashboard">
              Dashboard
            </NavLink>
          )}
        </div>
      </div>
      <div className="navbar-center"></div>
      <div className="navbar-end">
        {!user && (
          <>
            <NavLink className="btn btn-ghost" to="login">
              Log in
            </NavLink>
            <NavLink className="btn btn-ghost" to="register">
              Register
            </NavLink>
          </>
        )}
        {user && (
          <NavLink className="btn btn-ghost" to="cart">
            Cart
          </NavLink>
        )}
        {user && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              <span className="text-nowrap">My account</span>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 z-1 w-52 p-2"
            >
              {user && (
                <li>
                  <NavLink to="/orders" className="btn btn-ghost">
                    orders
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink to="user/settings" className="btn btn-ghost">
                  settings 404
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-ghost">
                  logout
                </button>
              </li>
            </ul>
          </div>
        )}
        <div className="dropdown">
          <div className="btn btn-ghost" tabIndex={0}>
            Theme
          </div>
          <ul className="menu menu-sm bg-base-100 p2 dropdown-content z-1">
            {THEMES.map((theme) => (
              <li key={theme}>
                <button
                  className="btn btn-ghost"
                  onClick={() => setTheme(theme)}
                >
                  {theme}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
