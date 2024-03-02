import React from 'react'
import { TdLink } from '../components/TdLink'
import { Icon } from '../components/ui'
import { toQueryString } from './helpers'
import { RestClient } from './rest'
import { parser } from './search'
import { LightFile } from '../types/global'

const cacheTypes = {}
const cacheSchemas = {}

export class GuillotinaClient {
  rest: RestClient
  pathContainsContainer: boolean
  constructor(rest: RestClient, pathContainsContainer: boolean) {
    this.rest = rest
    this.pathContainsContainer = pathContainsContainer
  }

  getContainerFromPath = (path) => {
    if (this.pathContainsContainer) {
      if (path.startsWith('/')) {
        path = path.substring(1)
      }
      const parts = path.split('/')
      return `${parts[0]}/${parts[1]}/`
    }
    return ''
  }

  clearContainerFromPath = (path) => {
    if (this.pathContainsContainer) {
      return `/${this.cleanPath(path)}`
    }
    return path
  }

  async getContext(path) {
    switch (path) {
      case '/':
        return await this.rest.get('')
      default:
        if (path.startsWith('/')) {
          path = path.substring(1)
        }
        return await this.rest.get(path)
    }
  }

  async get(path) {
    if (path.startsWith('/')) {
      path = path.slice(1)
    }
    return await this.rest.get(path)
  }

  getQueryParamsPostresql({ start = 0, pageSize = 10, withDepth = true }) {
    let result = []

    result = [
      ...parser(start.toString(), 'b_start'),
      ...parser(pageSize.toString(), 'b_size'),
    ]
    if (withDepth) {
      result = [...result, ...(parser('1', 'depth') ?? [])]
    }
    return result
  }

  getQueryParamsElasticsearch({
    start = 0,
    pageSize = 10,
    path,
    withDepth = true,
  }) {
    let result = []
    let containerPath = this.getContainerFromPath(path)

    if (containerPath.startsWith('/')) {
      containerPath = containerPath.slice(1)
    }
    let objectPath = path.replace(containerPath, '')
    if (objectPath.endsWith('/')) {
      objectPath = objectPath.slice(0, -1)
    }

    result = [
      ...parser(start.toString(), '_from'),
      ...parser(pageSize.toString(), 'size'),
      ...parser('*', '_metadata'),
    ]

    if (withDepth) {
      result = [...result, ...(parser('1', 'depth') ?? [])]
    }
    if (objectPath !== '') {
      result = [...result, ...parser(objectPath, 'path__wildcard')]
    }
    return result
  }

  getItemsColumn() {
    const smallcss = { width: 25 }
    const mediumcss = { width: 120 }

    return [
      {
        label: '',
        isSortable: false,
        child: (m) => <td style={smallcss}>{<Icon icon={m.icon} />}</td>,
      },
      {
        label: 'type',
        key: 'type_name',
        isSortable: false,
        child: (m) => (
          <TdLink style={smallcss} model={m}>
            <span className="tag">{m.type}</span>
          </TdLink>
        ),
      },
      {
        label: 'id/name',
        key: 'title',
        isSortable: true,
        child: (m, navigate, search) => (
          <TdLink model={m}>
            {m.name}
            {search && (
              <React.Fragment>
                <br />
                <span className="is-size-7 tag is-light">{m.path}</span>
              </React.Fragment>
            )}
          </TdLink>
        ),
      },
      {
        label: 'created',
        key: 'creation_date',
        isSortable: true,
        child: (m) => {
          return (
            <td style={mediumcss} className="is-size-7 is-vcentered">
              {m.created}
            </td>
          )
        },
      },
      {
        label: 'modified',
        key: 'modification_date',
        isSortable: true,
        child: (m) => (
          <td style={mediumcss} className="is-size-7 is-vcentered">
            {m.updated}
          </td>
        ),
      },
    ]
  }

  // BBB API changes. Compat G5 and G6
  applyCompat(data) {
    data.member = data.items
    data.items_count = data.items_total
    return data
  }

  async search(
    path: string,
    params: string | string[][],
    container = false,
    prepare = true
  ) {
    if (path.startsWith('/')) {
      path = path.slice(1)
    }

    if (container) {
      path = this.getContainerFromPath(path)
    }

    const query = prepare ? toQueryString(params as string[][]) : params
    const url = `${path}@search?${query}`
    const res = await this.rest.get(url)
    const data = await res.json()
    return this.applyCompat(data)
  }

  async canido(path, permissions) {
    if (path.startsWith('/')) {
      path = path.slice(1)
    }
    if (Array.isArray(permissions)) {
      permissions.join(',')
    }
    const url = `${path}@canido?permissions=${permissions}`
    return await this.rest.get(url)
  }

  async createObject(path, data) {
    return await this.rest.post(path, data)
  }

  cleanPath(path) {
    const url = path.split('/').slice(3)
    return `${url.join('/')}`
  }

  async delete(path, data) {
    return await this.rest.delete(path, data)
  }

  async create(path, data) {
    if (path.startsWith('/')) {
      path = path.substring(1)
    }
    return await this.rest.post(path, data)
  }

  async post(path, data) {
    return await this.create(path, data)
  }

  async patch(path, data) {
    if (path.startsWith('/')) {
      path = path.substring(1)
    }
    return await this.rest.patch(path, data)
  }

  async upload(path, file) {
    if (path.startsWith('/')) {
      path = path.substring(1)
    }
    return await this.rest.upload(path, file)
  }

  async download(path) {
    if (path.startsWith('/')) {
      path = path.substring(1)
    }
    return await this.rest.get(path)
  }

  async getTypeSchema(path, name) {
    if (!cacheSchemas[name]) {
      const url = this.getContainerFromPath(path)
      // todo: handle db case (only addable containers)
      const res = await this.rest.get(`${url}@types/${name}`)
      cacheSchemas[name] = await res.json()
    }
    return cacheSchemas[name]
  }

  async getAddons(path) {
    return await this.rest.get(`${path}@addons`)
  }

  async installAddon(path, key) {
    return await this.rest.post(`${path}@addons`, { id: key })
  }

  async removeAddon(path, key) {
    return await this.rest.delete(`${path}@addons`, { id: key })
  }

  async getGroups(path) {
    const endpoint = `${this.getContainerFromPath(path)}@groups`
    return await this.rest.get(endpoint)
  }

  async getUsers(path) {
    const endpoint = `${this.getContainerFromPath(path)}@users`
    return await this.rest.get(endpoint)
  }

  async getPrincipals(path) {
    const groups = this.getGroups(path)
    const users = this.getUsers(path)
    const [gr, usr] = await Promise.all([groups, users])

    return {
      groups: gr.ok ? await gr.json() : [],
      users: usr.ok ? await usr.json() : [],
    }
  }

  async getRoles(path) {
    const endpoint = `${this.getContainerFromPath(path)}@available-roles`
    return await this.rest.get(endpoint)
  }

  async getAllPermissions(path) {
    // paths used to query the API always has to start without a "/"
    if (path.startsWith('/')) {
      path = path.slice(1)
    }
    const req = await this.rest.get(path + '@all_permissions')
    const resp = await req.json()
    const permissions = Array.from(new Set(extractPermissions(resp)))
    return permissions
  }

  async getTypes(path) {
    if (path.startsWith('/')) {
      path = path.slice(1)
    }
    if (!cacheTypes[path]) {
      const types = await this.rest.get(path + '@addable-types')
      if (types.status === 401 || types.status === 404) {
        cacheTypes[path] = []
      } else {
        const res = await types.json()
        cacheTypes[path] = res
      }
    }
    return cacheTypes[path]
  }
}

export function getClient(url, container, auth) {
  return new GuillotinaClient(
    new RestClient(url, container, auth),
    container === '/'
  )
}

export const lightFileReader = (file) => {
  return new Promise<LightFile>((resolve) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = (e) => {
      const fileData = e.target.result
      resolve({
        filename: file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
        data: fileData,
        'content-type': file.type,
      })
    }
  })
}

const extractPermissions = (data) => {
  let result = []
  if (typeof data !== 'object') {
    // do nothing
  } else if (!Array.isArray(data) && data.permission) {
    result = result.concat([data.permission])
  } else if (!Array.isArray(data)) {
    Object.keys(data).map(
      (key) => (result = result.concat(extractPermissions(data[key])))
    )
  } else if (Array.isArray(data)) {
    data.map((item) => (result = result.concat(extractPermissions(item))))
  }
  return result
}
