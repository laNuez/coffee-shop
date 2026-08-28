import { useRouteError } from 'react-router'
import NotFound from '../pages/NotFoundPage'
import { DocumentTitle } from './DocumentTitle'

// TODO: rework errors and use a custom fetcher?
export const RouteError = () => {
  const error = useRouteError()

  const { status } = error as {
    status: number
  }

  if (status === 404)
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
