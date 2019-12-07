

export class RestClient {

  constructor(url, auth) {
    this.auth = auth
    this.url = url
  }

  async request(path, data) {
    data = data || {}
    data.headers = this.auth.getHeaders()
    return await fetch(`${this.url}${path}`, data)
  }

  getHeaders() {
    const authToken  = this.auth.getToken()
    if (!authToken) return false;
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + authToken
    }
  }

  async post(path, data) {
    return await this.request(path, {
      method: 'post',
      body: JSON.stringify(data)
    })
  }

  async get(path) {
    return await this.request(path, {})
  }

  async put(path, data) {
    return await this.request(path, {
      method: 'put',
      body: JSON.stringify(data)
    })
  }

  async patch(path, data) {
    return await this.request(path, {
      method: 'patch',
      body: JSON.stringify(data)
    })
  }

  async del(path) {
    return await this.request(path, {
      method: 'delete',
    })
  }
}
