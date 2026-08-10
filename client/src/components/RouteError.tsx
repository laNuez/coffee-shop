export const RouteError = () => {
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
