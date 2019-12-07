
import jwt_decode from 'jwt-decode'

export const GUILLO = "http://localhost:8080/db/crawler/"

const url = (endpoint) => `${GUILLO}${endpoint}`


class Auth {


  async login(username, password) {
      const data = await fetch(url('@login'), {
        method: 'post',
        body: JSON.stringify({
          username: username,
          password:password
        })
      })
      if (data.status === 200) {
        const credentials = await data.json()
        this.storeAuth(credentials, username)
        return true
      }
      localStorage.removeItem('auth');
      localStorage.removeItem('auth_expires');
      return false
  }

  get isLogged() {
    if (typeof localStorage === 'undefined') {
      return false
    }
    const [token, expires] = this._getToken()
    if (!token || !expires) {
      return false
    }
    if (this.isExpired(expires)) {
        return false
    }
    return true
  }

  get username() {
    if (typeof localStorage === 'undefined') {
      return false
    }
    const [token] = this._getToken()
    const data = jwt_decode(token)
    return data.id
  }

  storeAuth(data) {
    console.log(jwt_decode(data.token))
    localStorage.setItem('auth', data.token)
    localStorage.setItem('auth_expires', data.exp);
  }

  logout() {
    localStorage.removeItem("auth")
    localStorage.removeItem("auth_expires")
  }

  async refreshToken() {
    let data = await fetch(url('@login-refresh'), {
      headers: this.getHeaders(),
      method: 'post',
    })
    this.storeAuth(data)
    return data.token
  }

  isExpired(expiration) {
    let now = new Date().getTime()
    if (parseInt(expiration*1000) > now) {
      return false
    }
    return true
  }

  _getToken() {
    return [
      localStorage.getItem('auth'),
      localStorage.getItem('auth_expires')
    ]
  }

  async getToken() {
    let [token, expires] = this._getToken()

    if (this.isExpired(expires)) {
      token = await this.refreshToken()
    }
    if (token) {
      return token
    }
    return false;
  }

  getHeaders() {
    const [authToken,]  = this._getToken()
    if (!authToken) return false;
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + authToken
    }
  }

}

let AuthService = new Auth()

export default AuthService;

