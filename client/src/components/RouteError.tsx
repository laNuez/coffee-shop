import { Navigate, useRouteError } from 'react-router'
import NotFound from '../pages/NotFoundPage'
import { DocumentTitle } from './DocumentTitle'
import { NotFoundError, UnauthorizedError } from '../util/util'

export const RouteError = () => {
  const error = useRouteError()

  if (error instanceof UnauthorizedError) {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />
  }

  if (error instanceof NotFoundError)
    return (
      <>
        <DocumentTitle title="Not Found" />
        <NotFound />
      </>
    )

  return (
    <div className="flex items-center justify-center pt-24">
      <div>
        <h1 className="mb-2 text-2xl">Something went wrong</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            window.location.reload()
          }}
        >
          Reload page
        </button>
      </div>
    </div>
  )
}
