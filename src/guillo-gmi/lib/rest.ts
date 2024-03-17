import { LightFile } from '../types/global'
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

  async request(path: string, data?: RequestInit, headers?: HeadersInit) {
    if (path.indexOf(this.url) !== -1) {
      path = path.replace(this.url, '')
    }

    if (this.container !== '/' && path.indexOf(this.container) === -1) {
      path = `${this.container}${path}`
    }

    if (!path.startsWith('/')) {
      path = `/${path}`
    }
    const dataRequest = data || {}
    dataRequest.headers = headers || this.getHeaders()
    return await fetch(`${this.url}${path}`, dataRequest)
  }

  getHeaders(): HeadersInit {
    const authToken = this.auth.getToken()
    const headersInit: HeadersInit = {}

    if (!authToken) return headersInit

    headersInit.Accept = 'application/json'
    headersInit['Content-Type'] = 'application/json'
    headersInit.Authorization = 'Bearer ' + authToken
    return headersInit
  }

  async post(path: string, data: unknown) {
    return await this.request(path, {
      method: 'post',
      body: JSON.stringify(data),
    })
  }

  async get(path: string) {
    return await this.request(path)
  }

  async put(path: string, data: unknown) {
    return await this.request(path, {
      method: 'put',
      body: JSON.stringify(data),
    })
  }

  async patch(path: string, data: unknown) {
    return await this.request(path, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async upload(path: string, data: LightFile) {
    const headers = this.getHeaders()
    const newHeaders: HeadersInit = {}
    newHeaders['Content-Type'] = data['content-type']
    newHeaders['X-UPLOAD-FILENAME'] = data.filename
    newHeaders['Content-Encoding'] = 'base64'
    return await this.request(
      path,
      {
        method: 'PATCH',
        body: data.data,
      },
      {
        ...headers,
        ...newHeaders,
      }
    )
  }

  async delete(path: string, data: unknown) {
    return await this.request(path, {
      method: 'delete',
      body: JSON.stringify(data),
    })
  }
}
