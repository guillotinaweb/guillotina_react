import jwt_decode from 'jwt-decode'
import { IndexSignature } from '../types/global'

export class Auth {
  maxRetry = 1
  retryRefresh = 0
  events = {}
  url: string
  base_url: string
  errors: string

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
          password: password,
        }),
      })
      if (data.status === 200) {
        const credentials = await data.json()
        this.storeAuth(credentials)
        return true
      } else {
        this.errors = 'invalid_credentials'
      }
    } catch (e) {
      this.errors = 'failed_to_fetch'
      return false
    }
    localStorage.removeItem('auth')
    localStorage.removeItem('auth_expires')
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
    const data: IndexSignature = jwt_decode(token)
    console.log(token)
    return data.id
  }

  storeAuth(data) {
    localStorage.setItem('auth', data.token)
    localStorage.setItem(
      'auth_expires',
      new Date(data.exp).getTime().toString()
    )
  }

  cleanAuth() {
    localStorage.removeItem('auth')
    localStorage.removeItem('auth_expires')
  }

  logout() {
    this.cleanAuth()
  }

  async refreshToken() {
    console.log('refresh!!!')
    this.retryRefresh++
    const data = await fetch(this.getUrl('@login-renew'), {
      headers: this.getHeaders(),
      method: 'post',
    })
    if (data.status === 401) {
      // invalid token
      this.cleanAuth()
      this.logout()
      return
    }
    const res = await data.json()
    console.log('refresh data', res)
    this.storeAuth(res)
    console.log('token refreshed')
    this.retryRefresh = 0
    return res.token
  }

  willExpire(expiration) {
    const now = new Date().getTime()
    if (parseInt(expiration) * 1000 < now + 10 * 1000) {
      return true
    }
    return false
  }

  isExpired(expiration) {
    const now = new Date().getTime()
    if (parseInt(expiration) * 1000 > now) {
      return false
    }
    return true
  }

  _getToken() {
    return [localStorage.getItem('auth'), localStorage.getItem('auth_expires')]
  }

  getToken() {
    const [token] = this._getToken()
    return token
  }

  getHeaders() {
    const [authToken, expires] = this._getToken()
    if (!authToken) return {}

    if (this.willExpire(expires) && this.retryRefresh < this.maxRetry) {
      // eslint-disable-next-line no-extra-semi
      ;(async () => await this.refreshToken())()
    }

    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + authToken,
    }
  }
}
