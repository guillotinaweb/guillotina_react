import React from 'react'
import { Component } from 'react'

const ERRORS = {
  failed_to_fetch: 'Failed to fetch data: Backend not running?',
  invalid_credentials: 'Failed! Invalid credentials',
}

export class Login extends Component {
  state = {
    username: '',
    password: '',
    loading: undefined,
    schema: '',
    errors: undefined,
  }

  constructor(props) {
    super(props)
    if (props.schemas) {
      this.state.schema = props.schemas[0]
    }
  }

  ref = React.createRef()

  doLogin = async (ev) => {
    ev.preventDefault()
    this.setState({ loading: true, errors: undefined })
    const { username, password, schema } = this.state

    if (schema !== '') {
      this.props.auth.setAccount(schema)
    }
    const auth = this.props.auth
    const res = await auth.login(username, password)

    if (!res) {
      this.setState({ errors: auth.errors, loading: false })
      return
    }

    if (this.props.onLogin) {
      this.props.onLogin()
    }
  }

  componentDidMount() {
    this.ref.current.focus()
  }

  render() {
    let { password, username, errors } = this.state
    const { schemas } = this.props
    return (
      <React.Fragment>
        <form
          className="login__form"
          action=""
          onSubmit={this.doLogin}
          data-test="formLoginTest"
        >
          <div className="field">
            <label className="label">Username:</label>
            <input
              type="text"
              className="input"
              placeholder="Username"
              onChange={(e) => this.setState({ username: e.target.value })}
              value={username}
              ref={this.ref}
              data-test="inputUsernameLoginTest"
            />
          </div>
          <div className="field">
            <label className="label">Password:</label>
            <input
              type="password"
              className="input"
              onChange={(e) => this.setState({ password: e.target.value })}
              value={password}
              data-test="inputPasswordLoginTest"
            />
          </div>
          {schemas && (
            <div className="field">
              <label className="label">Schema:</label>
              <div className="select">
                <select
                  onChange={(e) => this.setState({ schema: e.target.value })}
                >
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
            {errors && (
              <p className="has-text-danger">
                {ERRORS[errors] || 'Generic error'}
              </p>
            )}
          </div>
        </form>
      </React.Fragment>
    )
  }
}
