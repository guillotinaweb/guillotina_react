import React from 'react'
import { TdLink } from '../components/TdLink'
import { Icon } from '../components/ui'
import { toQueryString } from './helpers'
import { RestClient } from './rest'
import { parser } from './search'
import { IndexSignature, LightFile } from '../types/global'
import { ItemModel } from '../models'
import { Auth } from './auth'
import {
  GuillotinaGroup,
  GuillotinaUser,
  ReturnSearchCompatible,
} from '../types/guillotina'

const cacheTypes: IndexSignature = {}
const cacheSchemas: IndexSignature = {}

export class GuillotinaClient {
  rest: RestClient
  pathContainsContainer: boolean
  constructor(rest: RestClient, pathContainsContainer: boolean) {
    this.rest = rest
    this.pathContainsContainer = pathContainsContainer
  }

  getContainerFromPath = (path: string) => {
    if (this.pathContainsContainer) {
      if (path.startsWith('/')) {
        path = path.substring(1)
      }
      const parts = path.split('/')
      return `${parts[0]}/${parts[1]}/`
    }
    return ''
  }

  clearContainerFromPath = (path: string) => {
    if (this.pathContainsContainer) {
      return `/${this.cleanPath(path)}`
    }
    return path
  }

  async getContext(path: string) {
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

  async get(path: string) {
    if (path.startsWith('/')) {
      path = path.slice(1)
    }
    return await this.rest.get(path)
  }

  getQueryParamsSearchFunction(name: string) {
    if (name === 'getQueryParamsElasticsearch') {
      return this.getQueryParamsElasticsearch
    }
    return this.getQueryParamsPostresql
  }
  getQueryParamsPostresql({
    start = 0,
    pageSize = 10,
    withDepth = true,
  }: {
    start?: number
    pageSize?: number
    path?: string
    withDepth?: boolean
  }) {
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
  }: {
    start?: number
    pageSize?: number
    path: string
    withDepth?: boolean
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
      ...parser(pageSize.toString(), '_size'),
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
        child: (m: ItemModel) => (
          <td style={smallcss}>{<Icon icon={m.icon} />}</td>
        ),
      },
      {
        label: 'type',
        key: 'type_name',
        isSortable: false,
        child: (m: ItemModel) => (
          <TdLink style={smallcss} model={m}>
            <span className="tag">{m.type}</span>
          </TdLink>
        ),
      },
      {
        label: 'id/name',
        key: 'title',
        isSortable: true,
        child: (m: ItemModel, _navigate: () => void, search: boolean) => (
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
        child: (m: ItemModel) => {
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
        child: (m: ItemModel) => (
          <td style={mediumcss} className="is-size-7 is-vcentered">
            {m.updated}
          </td>
        ),
      },
    ]
  }

  // BBB API changes. Compat G5 and G6
  applyCompat<T>(data: { items: T[]; items_total: number }) {
    const result: ReturnSearchCompatible<T> = {
      ...data,
      member: data.items,
      items_count: data.items_total,
    }
    return result
  }

  async search<T>(
    path: string,
    params: string | IndexSignature<string>,
    container = false,
    prepare = true,
    signal?: AbortSignal
  ) {
    if (path.startsWith('/')) {
      path = path.slice(1)
    }

    if (container) {
      path = this.getContainerFromPath(path)
    }

    const query = prepare
      ? toQueryString(params as IndexSignature<string>)
      : params
    const url = `${path}@search?${query}`
    const res = await this.rest.get(url, signal)
    const data = await res.json()
    return this.applyCompat<T>(data)
  }

  async canido(path: string, permissions: string | string[]) {
    if (path.startsWith('/')) {
      path = path.slice(1)
    }
    if (Array.isArray(permissions)) {
      permissions.join(',')
    }
    const url = `${path}@canido?permissions=${permissions}`
    return await this.rest.get(url)
  }

  async createObject(path: string, data: unknown) {
    return await this.rest.post(path, data)
  }

  cleanPath(path: string) {
    const url = path.split('/').slice(3)
    return `${url.join('/')}`
  }

  async delete(path: string, data: unknown) {
    return await this.rest.delete(path, data)
  }

  async create(path: string, data: unknown) {
    if (path.startsWith('/')) {
      path = path.substring(1)
    }
    return await this.rest.post(path, data)
  }

  async post(path: string, data: unknown) {
    return await this.create(path, data)
  }

  async patch(path: string, data: unknown) {
    if (path.startsWith('/')) {
      path = path.substring(1)
    }
    return await this.rest.patch(path, data)
  }

  async upload(path: string, file: LightFile) {
    if (path.startsWith('/')) {
      path = path.substring(1)
    }
    return await this.rest.upload(path, file)
  }

  async download(path: string) {
    if (path.startsWith('/')) {
      path = path.substring(1)
    }
    return await this.rest.get(path)
  }

  async getTypeSchema(path: string, name: string) {
    if (!cacheSchemas[name]) {
      const url = this.getContainerFromPath(path)
      // todo: handle db case (only addable containers)
      const res = await this.rest.get(`${url}@types/${name}`)
      cacheSchemas[name] = await res.json()
    }
    return cacheSchemas[name]
  }

  async getAddons(path: string) {
    return await this.rest.get(`${path}@addons`)
  }

  async installAddon(path: string, key: string) {
    return await this.rest.post(`${path}@addons`, { id: key })
  }

  async removeAddon(path: string, key: string) {
    return await this.rest.delete(`${path}@addons`, { id: key })
  }

  async getGroups(path: string) {
    const endpoint = `${this.getContainerFromPath(path)}@groups`
    return await this.rest.get(endpoint)
  }

  async getUsers(path: string) {
    const endpoint = `${this.getContainerFromPath(path)}@users`
    return await this.rest.get(endpoint)
  }

  async getPrincipals(
    path: string
  ): Promise<{
    groups: GuillotinaGroup[]
    users: GuillotinaUser[]
  }> {
    const groups = this.getGroups(path)
    const users = this.getUsers(path)
    const [responseGroups, responseUsers] = await Promise.all([groups, users])
    let groupsData: GuillotinaGroup[] = []
    let usersData: GuillotinaUser[] = []

    if (responseGroups.ok) {
      const groupsDataResponse = await responseGroups.json()
      groupsData = groupsDataResponse.map(
        (group: {
          '@name': string
          id: string
          title: string
          users: string[]
          roles: string[]
        }) => {
          return {
            '@name': group.id,
            user_roles: group.roles,
            users: group.users,
          }
        }
      )
    }
    if (responseUsers) {
      const usersDataResponse = await responseUsers.json()
      usersData = usersDataResponse.map(
        (user: {
          '@name': string
          id: string
          fullname: string
          email: string
          roles: string[]
        }) => {
          return {
            '@name': user.id,
            user_roles: user.roles,
            fullname: user.fullname,
            email: user.email,
          }
        }
      )
    }
    return {
      groups: groupsData,
      users: usersData,
    }
  }

  async getRoles(path: string) {
    const endpoint = `${this.getContainerFromPath(path)}@available-roles`
    return await this.rest.get(endpoint)
  }

  async getAllPermissions(path: string) {
    // paths used to query the API always has to start without a "/"
    if (path.startsWith('/')) {
      path = path.slice(1)
    }
    const req = await this.rest.get(path + '@all_permissions')
    const resp = await req.json()
    const permissions = Array.from(new Set(extractPermissions(resp)))
    return permissions
  }

  async getTypes(path: string) {
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

export function getClient(url: string, container: string, auth: Auth) {
  return new GuillotinaClient(
    new RestClient(url, container, auth),
    container === '/'
  )
}

export const lightFileReader = (file: File) => {
  return new Promise<LightFile>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = (e) => {
      const fileData = e?.target?.result
      if (fileData) {
        resolve({
          filename: file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
          data: fileData,
          'content-type': file.type,
        })
      } else {
        reject('Error reading file')
      }
    }
  })
}

const extractPermissions = (data: IndexSignature) => {
  let result: string[] = []
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
