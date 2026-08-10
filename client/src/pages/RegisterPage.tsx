import { FormEvent } from 'react'
import { useInput } from '../hooks/useInput'
import { Link, useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { register } from '../lib/api'
import { XIcon } from 'lucide-react'
import { ApiError } from '../util/util'

const RegisterPage = () => {
  const username = useInput('')
  const email = useInput('', 'email')
  const password = useInput('', 'password')
  const confirmPassword = useInput('', 'password')
  const validationError =
    password.value !== confirmPassword.value ? 'Password must match' : ''

  const navigate = useNavigate()

  const registerMutation = useMutation<unknown, ApiError>({
    mutationFn: () => register(username.value, email.value, password.value),
    onSuccess: () => navigate('/login')
  })
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (validationError.length > 0) return
    registerMutation.mutate()
  }
  return (
    <div className="flex justify-center">
      <div>
        <form onSubmit={handleSubmit}>
          <div className="gap 3 card flex w-96 flex-col justify-between p-2 shadow-md">
            <div className="card-body">
              <div className="card-title">
                <h2 className="text-2xl">
                  Sign up to {import.meta.env.VITE_APP_NAME}
                </h2>
              </div>
              {registerMutation.error && (
                <div
                  role="alert"
                  className="alert alert-error alert-outline flex justify-between"
                >
                  <span>{registerMutation.error.error}</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-circle btn-xs"
                    onClick={registerMutation.reset}
                  >
                    <XIcon color="red" strokeWidth={1.5} />
                  </button>
                </div>
              )}
              <label>
                <span>Username</span>
                <input
                  {...username}
                  className="input input-lg bg-base-200 validator"
                  required
                  minLength={4}
                  maxLength={12}
                />
                <div className="validator-hint mt-0">
                  Must be at least 4 characters
                </div>
              </label>
              <label className="flex flex-col gap-1">
                <span>Email</span>
                <input
                  {...email}
                  className="input input-lg bg-base-200 validator"
                  required
                />
                <div className="validator-hint mt-0">Must be a valid email</div>
              </label>
              <label className="flex flex-col gap-1">
                <span>Password</span>
                <input
                  {...password}
                  className="input input-lg bg-base-200 validator"
                  required
                  minLength={6}
                  maxLength={100}
                />
                <div className="validator-hint">
                  Must be between 6 and 100 characters
                </div>
              </label>
              <label className="flex flex-col gap-1">
                <span>Confirm Password</span>
                <input
                  {...confirmPassword}
                  className="input input-lg bg-base-200 validator"
                  required
                  minLength={6}
                  maxLength={100}
                />
              </label>
              <div className="text-error">{validationError}</div>
            </div>
            <div className="card-actions flex-col items-center">
              <button className="btn btn-primary">Create an account</button>
              <Link className="hover:link text-sm" to="/login">
                Already have an account?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
