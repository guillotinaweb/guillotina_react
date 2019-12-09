
import {RestClient} from './rest'

let cacheTypes = {}
let cacheSchemas = {}


export class GuillotinaClient  {

  constructor(rest) {
    this.rest = rest
  }

  async getContext(path) {
    switch (path) {
      case "/":
        return await this.rest.get("")
      default:
          if (path.startsWith("/")) {
            path = path.substring(1)
          }
          return await this.rest.get(path)
    }
  }

  async createObject(path, data) {
    return await this.rest.post(path, data)
  }

  async getTypes(path) {
    if (!path.endsWith("/")) {
      path = `${path}/`
    }
    console.log("Fetching types for", path)
    if (path.startsWith("http")) {
      path = path.replace(this.rest.url, "")
    }
    if (!cacheTypes[path]) {
      const types = await this.rest.get(path + "@addable-types")
      const res = await types.json()
      cacheTypes[path] = res
    }
    return cacheTypes[path]
  }

  cleanPath(path) {
    return path.replace(this.rest.url, "")
  }

  async delete(path) {
    return await this.rest.delete(this.cleanPath(path))
  }

  async create(path, data) {
    if (path.startsWith("/")) {
      path = path.substring(1)
    }
    return await this.rest.post(path, data)
  }

  async getTypeSchema(path, name) {
    if (!cacheSchemas[name]) {
      let url = getContainerFromPath(path)
      // todo: handle db case (only addable containers)
      const res = await this.rest.get(`${url}@types/${name}`)
      cacheSchemas[name] = await res.json()
    }
    return cacheSchemas[name]
  }

}


const getContainerFromPath = (path) => {
  if (path.startsWith("/")) {
    path = path.substring(1)
  }
  let parts = path.split("/")
  return `${parts[0]}/${parts[1]}/`

}


export function getClient(url, auth) {
  return new GuillotinaClient(new RestClient(url, auth))
}
