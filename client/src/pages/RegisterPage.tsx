import { FormEvent, useEffect, useState } from 'react'
import { useInput } from '../hooks/useInput'
import { hcWithType } from 'server/dist/client'
import { Link, useNavigate } from 'react-router'
import { SERVER_URL } from '../util/constants'

const client = hcWithType(SERVER_URL)

const RegisterPage = () => {
  const username = useInput('')
  const email = useInput('', 'email')
  const password = useInput('', 'password')
  const confirmPassword = useInput('', 'password')
  const [validationError, setValidationError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    if (password.value !== confirmPassword.value) {
      return setValidationError('Password must match')
    }

    setValidationError('')
  }, [password.value, confirmPassword.value, email.value, username.value])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (validationError.length > 0) return
    const res = await client.register.$post({
      json: {
        username: username.value,
        email: email.value,
        password: password.value
      }
    })
    console.log(res)
    if (!res.ok) return console.log(res)

    navigate('/login')
  }
  return (
    <div className="flex justify-center">
      <div>
        <form onSubmit={submit}>
          <div className="gap 3 card flex w-96 flex-col justify-between p-2 shadow-md">
            <div className="card-body">
              <div className="card-title">
                <h2 className="text-2xl">Sign up to Coffee-shop</h2>
              </div>
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
              <div>{validationError}</div>
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
