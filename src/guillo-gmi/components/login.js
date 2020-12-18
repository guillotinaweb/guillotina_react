import React from 'react'
import { Component } from 'react'
import linkState from 'linkstate'

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
        <form className="login__form" action="" onSubmit={this.doLogin}>
          <div className="field">
            <label className="label">Username:</label>
            <input
              type="text"
              className="input"
              placeholder="Username"
              onChange={linkState(this, 'username')}
              value={username}
              ref={this.ref}
            />
          </div>
          <div className="field">
            <label className="label">Password:</label>
            <input
              type="password"
              className="input"
              onChange={linkState(this, 'password')}
              value={password}
            />
          </div>
          {schemas && (
            <div className="field">
              <label className="label">Schema:</label>
              <div className="select">
                <select onChange={linkState(this, 'schema')}>
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
            <button className="button is-warning" type="submit">
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
