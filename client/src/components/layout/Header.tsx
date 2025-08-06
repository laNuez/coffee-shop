import { useEffect } from 'react'
import { NavLink } from 'react-router'
import { themeChange } from 'theme-change'

const THEMES = ['light', 'dark', 'coffee']
export const Header = () => {
  useEffect(() => {
    themeChange(false)
  }, [])

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <NavLink className="btn btn-ghost" to="/">
          Home
        </NavLink>
      </div>
      <div>
        <NavLink className="btn btn-ghost" to="login">
          Log in
        </NavLink>
        <NavLink className="btn btn-ghost" to="register">
          Register
        </NavLink>
      </div>
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
            <NavLink to="logout">logout</NavLink>
          </li>
          <li>
            <details open>
              <summary>theme</summary>
              <ul>
                {THEMES.map((theme) => (
                  <li>
                    <button
                      className="btn btn-ghost"
                      data-set-theme={theme}
                      data-act-class="ACTIVECLASS"
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
    </div>
  )
}
