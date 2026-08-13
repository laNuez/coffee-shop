import { ReactNode } from 'react'

interface DrawerProps {
  id: string
  children: ReactNode
  sidebar: ReactNode
}

export const Drawer = (props: DrawerProps) => {
  const { id, sidebar, children } = props
  return (
    <div className="drawer lg:drawer-open mt-1">
      <input id={id} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor={id}
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        {sidebar}
      </div>
    </div>
  )
}
