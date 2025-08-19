import { FormEvent } from 'react'
import { useInput } from '../hooks/useInput'
import { Link, useLocation, useNavigate } from 'react-router'
import { useUserStore } from '../stores/userStore'
import { client } from '../lib/hono'

const LoginPage = () => {
  const username = useInput('')
  const password = useInput('', 'password')

  const fetchUser = useUserStore((state) => state.fetchUser)
  const navigate = useNavigate()
  const { state } = useLocation()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username || !password) return

    const res = await client.login.$post({
      json: {
        username: username.value,
        password: password.value
      }
    })
    if (!res.ok) return console.log(res)
    fetchUser().then(() => {
      navigate(state?.path || '/')
    })
  }

  return (
    <div className="flex justify-center">
      <div>
        <form onSubmit={submit}>
          <div className="gap 3 card flex w-96 flex-col justify-between p-2 shadow-md">
            <div className="card-body">
              <div className="card-title">
                <h2 className="text-2xl">Log in</h2>
              </div>
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
              <button className="btn btn-primary">Login</button>
              <Link className="hover:link text-sm" to="/login">
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
