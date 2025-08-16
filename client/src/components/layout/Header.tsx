import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useLogout, useUserStore } from '../../stores/userStore'

const THEMES = ['light', 'dark', 'coffee'] as const
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
      <div className="flex-1">
        <NavLink className="btn btn-ghost" to="/">
          Home
        </NavLink>
      </div>
      <div>
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
      </div>
      {user && (
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            Mi cuenta
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content z-1 bg-base-100 w-52 p-2"
          >
            <li>
              <NavLink to="user/settings">settings</NavLink>
            </li>
            <li>
              <button onClick={handleLogout}>logout</button>
            </li>
            <li>
              <details open>
                <summary>theme</summary>
                <ul>
                  {THEMES.map((theme) => (
                    <li>
                      <button
                        className="btn btn-ghost"
                        onClick={() => setTheme(theme)}
                      >
                        {theme}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
