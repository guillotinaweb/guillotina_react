
import jwt_decode from 'jwt-decode'

const noop = () => {}

export class Auth {

  maxRetry = 1
  retryRefresh = 0
  events = {}

  constructor(url) {
    this.url = url
    this.base_url = url
    this.errors = undefined
  }

  getUrl(endpoint) {
    return `${this.url}${endpoint}`
  }

  setAccount(account) {
    this.url = this.base_url + account
  }

  async login(username, password) {
    const url = this.getUrl('@login')
    try {
      const data = await fetch(url, {
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
      } else {
        this.errors = "invalid_credentials"
      }
    } catch (e) {
      this.errors = "failed_to_fetch"
      return false
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
    console.log(token)
    return data.id
  }

  storeAuth(data) {
    localStorage.setItem('auth', data.token)
    localStorage.setItem('auth_expires', data.exp);
  }

  cleanAuth() {
    localStorage.removeItem("auth")
    localStorage.removeItem("auth_expires")
  }

  logout() {
    this.cleanAuth()
  }

  async refreshToken() {
    console.log("refresh!!!")
    this.retryRefresh++
    let data = await fetch(this.getUrl('@login-renew'), {
      headers: this.getHeaders(),
      method: 'post',
    })
    if (data.status === 401) {
      // invalid token
      this.cleanAuth()
      this.onLogout()
      return
    }
    const res = await data.json()
    console.log("refresh data", res)
    this.storeAuth(res)
    console.log("token refreshed")
    this.retryRefresh = 0
    return data.token
  }

  willExpire(expiration) {
    let now = new Date().getTime()
    if ((parseInt(expiration)*1000)  < (now + 10*1000)) {
      return true
    }
    return false
  }

  isExpired(expiration) {
    let now = new Date().getTime()
    if (parseInt(expiration)*1000 > now) {
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

  getHeaders() {
    const [authToken, expires]  = this._getToken()
    if (!authToken) return false;

    if (this.willExpire(expires) && this.retryRefresh < this.maxRetry) {
      (async () => await this.refreshToken())()
    }

    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + authToken
    }
  }

}


