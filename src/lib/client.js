
import {RestClient} from './rest'

let cacheTypes = {}

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
    if (!cacheTypes[path]) {
      const types = await this.rest.get(path + "@addable-types")
      cacheTypes[path] = types
    }
    return cacheTypes[path]
  }


}

export function getClient(url, auth) {
  return new GuillotinaClient(new RestClient(url, auth))
}
