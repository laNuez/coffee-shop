import { useNavigate } from 'react-router'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-center pt-24">
      <div className="flex max-w-3xl flex-col gap-3 text-center">
        <h1 className="text-6xl">404</h1>
        <p className="text-4xl uppercase">Page not found</p>
        <p>
          The page you're looking for no longer exists <br />
          or is temporarily unavailable.
        </p>
        <button
          className="btn btn-secondary"
          onClick={() => {
            navigate('/')
          }}
        >
          Go home
        </button>
      </div>
    </div>
  )
}

export default NotFound
