import React, { useRef, useEffect } from 'react'
import useSetState from '../hooks/useSetState'

const ERRORS = {
  failed_to_fetch: 'Failed to fetch data: Backend not running?',
  invalid_credentials: 'Failed! Invalid credentials',
}
const initialState = {
  username: '',
  password: '',
  loading: undefined,
  errors: undefined,
}
export const Login = ({
  currentSchema,
  setCurrentSchema,
  schemas,
  auth,
  onLogin,
}) => {
  const [state, setState] = useSetState(initialState)
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const doLogin = async (ev) => {
    ev.preventDefault()
    setState({ loading: true, errors: undefined })
    const { username, password } = state

    if (currentSchema !== '') {
      auth.setAccount(currentSchema)
    }
    const res = await auth.login(username, password)

    if (!res) {
      setState({ errors: auth.errors, loading: false })
      return
    }

    if (onLogin) {
      onLogin()
    }
  }

  return (
    <React.Fragment>
      <form
        className="login__form"
        action=""
        onSubmit={doLogin}
        data-test="formLoginTest"
      >
        <div className="field">
          <label className="label">Username:</label>
          <input
            type="text"
            className="input"
            placeholder="Username"
            onChange={(e) => setState({ username: e.target.value })}
            value={state.username}
            ref={inputRef}
            data-test="inputUsernameLoginTest"
          />
        </div>
        <div className="field">
          <label className="label">Password:</label>
          <input
            type="password"
            className="input"
            placeholder="Password"
            onChange={(e) => setState({ password: e.target.value })}
            value={state.password}
            data-test="inputPasswordLoginTest"
          />
        </div>
        {schemas && schemas.length > 1 && (
          <div className="field">
            <label className="label">Schema:</label>
            <div className="select">
              <select onChange={(e) => setCurrentSchema(e.target.value)}>
                {schemas.map((s) => (
                  <option value={s} key={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div className="field">
          <button
            className="button is-warning"
            type="submit"
            data-test="btnLoginTest"
          >
            Login
          </button>
        </div>
        <div className="field">
          {state.errors && (
            <p className="has-text-danger">
              {ERRORS[state.errors] || 'Generic error'}
            </p>
          )}
        </div>
      </form>
    </React.Fragment>
  )
}
