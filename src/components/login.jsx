
import React from 'react';

import {Component} from 'react';
import linkState from 'linkstate';


export class Login extends Component {

    state = {
        username: '',
        password: '',
        loading: undefined
    }

    doLogin = async (ev) => {
        ev.preventDefault()
        this.setState({loading:true})
        const auth = this.props.auth
        const {username, password} = this.state;
        const res = await auth.login(username, password)
          if (this.props.onLogin) {
            this.props.onLogin()
          }
    }


    render() {
      let {password, username, errors, loading } = this.state
      return (
        <form action="" onSubmit={this.doLogin}>
          <div className="field">
            <label className="label">Username:</label>
              <input type="text" className="input"
                placeholder="Username"
                onChange={linkState(this, 'username')}
                value={username}
                />
          </div>
          <div className="field">
            <label className="label">Password:</label>
              <input type="password" className="input"
                onChange={linkState(this, 'password')}
                value={password}
                />
            </div>
            <div className="field">
                <button className="button is-warning" type="submit">Login</button>
            </div>
        </form>
      )
    }
}
