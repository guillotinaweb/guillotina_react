import { RestClient } from "./rest";
import { toQueryString } from "./helpers";

let cacheTypes = {};
let cacheSchemas = {};

export class GuillotinaClient {
  constructor(rest, isContainer) {
    this.rest = rest;
    this.isContainer = isContainer;
  }

  async getContext(path) {
    switch (path) {
      case "/":
        return await this.rest.get("");
      default:
        if (path.startsWith("/")) {
          path = path.substring(1);
        }
        return await this.rest.get(path);
    }
  }

  async get(path) {
    if (path.startsWith("/")) {
      path = path.slice(1);
    }
    return await this.rest.get(path);
  }

  async getItems(path, start = 0) {
    if (path.startsWith("/")) {
      path = path.slice(1);
    }
    const result = await this.rest.get(
      `${path}@search?depth=1&b_start=${start}&b_size=20`
    );
    return await result.json();
  }

  async search(path, params, container = false, prepare = true, start = 0) {
    if (path.startsWith("/")) {
      path = path.slice(1);
    }
    if (container) {
      path = getContainerFromPath(path);
    }
    let query = prepare ? toQueryString(params) : params;
    const url = `${path}@search?${query}&b_start=${start}&b_size=20`;
    return await this.rest.get(url);
  }

  async canido(path, permissions) {
    if (path.startsWith("/")) {
      path = path.slice(1);
    }
    if (Array.isArray(permissions)) {
      permissions.join(",");
    }
    const url = `${path}@canido?permissions=${permissions}`;
    return await this.rest.get(url);
  }

  async createObject(path, data) {
    return await this.rest.post(path, data);
  }

  cleanPath(path) {
    return path.replace(this.rest.url, "");
  }

  async delete(path, data) {
    return await this.rest.delete(this.cleanPath(path), data);
  }

  async create(path, data) {
    if (path.startsWith("/")) {
      path = path.substring(1);
    }
    return await this.rest.post(path, data);
  }

  async patch(path, data) {
    if (path.startsWith("/")) {
      path = path.substring(1);
    }
    return await this.rest.patch(path, data);
  }

  async getTypeSchema(path, name) {
    if (!cacheSchemas[name]) {
      let url = getContainerFromPath(path);
      // todo: handle db case (only addable containers)
      const res = await this.rest.get(`${url}@types/${name}`);
      cacheSchemas[name] = await res.json();
    }
    return cacheSchemas[name];
  }

  async getAddons(path) {
    return await this.rest.get(`${path}@addons`);
  }

  async installAddon(path, key) {
    return await this.rest.post(`${path}@addons`, { id: key });
  }

  async removeAddon(path, key) {
    return await this.rest.delete(`${path}@addons`, { id: key });
  }

  async getGroups(path) {
    const endpoint = `${getContainerFromPath(path)}@groups`;
    return await this.rest.get(endpoint);
  }

  async getRoles(path) {
    const endpoint = `${getContainerFromPath(path)}@available-roles`;
    return await this.rest.get(endpoint);
  }

  async getTypes(path) {
    if (!path.endsWith("/")) {
      path = `${path}/`;
    }
    if (path.startsWith("http")) {
      path = path.replace(this.rest.url, "");
    }
    if (!cacheTypes[path]) {
      const types = await this.rest.get(path + "@addable-types");
      if (types.status === 401) {
        cacheTypes[path] = [];
      } else {
        const res = await types.json();
        cacheTypes[path] = res;
      }
    }
    return cacheTypes[path];
  }
}

export function getClient(url, auth, isContainer = false) {
  return new GuillotinaClient(new RestClient(url, auth), isContainer);
}

export const getContainerFromPath = path => {
  if (path.startsWith("/")) {
    path = path.substring(1);
  }
  let parts = path.split("/");
  return `${parts[0]}/${parts[1]}/`;
};
