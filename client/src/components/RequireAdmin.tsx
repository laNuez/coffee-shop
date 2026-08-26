import { PropsWithChildren } from 'react'
import { useUserStore } from '../stores/userStore'
import { Navigate, useLocation } from 'react-router'

export const RequireAdmin = (props: PropsWithChildren) => {
  const user = useUserStore((state) => state.user)
  const location = useLocation()
  if (user === undefined) return <div>fetching user</div>
  return user && (user.role === 'admin' || user.role === 'admin_demo') ? (
    props.children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  )
}
