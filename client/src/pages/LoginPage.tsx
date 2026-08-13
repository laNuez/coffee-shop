import { FormEvent } from 'react'
import { useInput } from '../hooks/useInput'
import { Link, useLocation, useNavigate } from 'react-router'
import { useUserStore } from '../stores/userStore'
import { login } from '../lib/api'
import { useMutation } from '@tanstack/react-query'
import { ApiError } from '../util/util'
import { XIcon } from 'lucide-react'

const LoginPage = () => {
  const username = useInput('')
  const password = useInput('', 'password')
  const fetchUser = useUserStore((state) => state.fetchUser)
  const navigate = useNavigate()
  const { state } = useLocation()

  const loginMutation = useMutation<unknown, ApiError>({
    mutationFn: () => login(username.value, password.value),
    onSuccess: () => {
      fetchUser().then(() => {
        navigate(state?.path || '/')
      })
    }
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username || !password) return
    loginMutation.mutate()
  }

  return (
    <div className="flex justify-center">
      <div>
        <form onSubmit={handleSubmit}>
          <div className="gap 3 card flex w-96 flex-col justify-between p-2 shadow-md">
            <div className="card-body">
              <div className="card-title">
                <h2 className="text-2xl">Log in</h2>
              </div>
              {loginMutation.error && (
                <div
                  role="alert"
                  className="alert alert-error alert-outline flex justify-between"
                >
                  <span>{loginMutation.error.error}</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-circle btn-xs"
                    onClick={loginMutation.reset}
                  >
                    <XIcon color="red" strokeWidth={1.5} />
                  </button>
                </div>
              )}
              <label className="flex flex-col gap-1">
                <span>Username</span>
                <input
                  {...username}
                  className="input input-lg bg-base-200 user-invalid:validator"
                  required
                />
                <div className="validator-hint mt-0">Required</div>
              </label>
              <label className="flex flex-col gap-1">
                <span>Password</span>
                <input
                  {...password}
                  className="input input-lg bg-base-200 user-invalid:validator"
                  required
                />
                <div className="validator-hint mt-0">Required</div>
              </label>
            </div>
            <div className="card-actions flex-col items-center">
              <button
                className="btn btn-primary"
                disabled={loginMutation.isPending}
              >
                Login
              </button>
              <Link className="hover:link text-sm" to="/register">
                Sign up instead
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
