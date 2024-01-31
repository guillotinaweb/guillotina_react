import { Auth } from './auth'

export class RestClient {
  url: string
  container: string
  auth: Auth

  constructor(url: string, container: string, auth: Auth) {
    this.auth = auth
    this.url = url
    this.container = container
  }

  async request(path, data = undefined, headers = undefined) {
    if (path.indexOf(this.url) !== -1) {
      path = path.replace(this.url, '')
    }

    if (this.container !== '/' && path.indexOf(this.container) === -1) {
      path = `${this.container}${path}`
    }

    if (!path.startsWith('/')) {
      path = `/${path}`
    }
    data = data || {}
    data.headers = headers || this.getHeaders()
    return await fetch(`${this.url}${path}`, data)
  }

  getHeaders() {
    const authToken = this.auth.getToken()
    if (!authToken) return {}
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + authToken,
    }
  }

  async post(path, data) {
    return await this.request(path, {
      method: 'post',
      body: JSON.stringify(data),
    })
  }

  async get(path) {
    return await this.request(path)
  }

  async put(path, data) {
    return await this.request(path, {
      method: 'put',
      body: JSON.stringify(data),
    })
  }

  async patch(path, data) {
    return await this.request(path, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async upload(path, data) {
    const headers = this.getHeaders()
    delete headers['Content-Type']
    headers['Content-Type'] = data['content-type']
    headers['X-UPLOAD-FILENAME'] = data.filename
    headers['Content-Encoding'] = 'base64'
    return await this.request(
      path,
      {
        method: 'PATCH',
        body: data.data,
      },
      headers
    )
  }

  async delete(path, data = undefined) {
    return await this.request(path, {
      method: 'delete',
      body: JSON.stringify(data),
    })
  }
}
