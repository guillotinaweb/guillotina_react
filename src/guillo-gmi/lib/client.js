import { RestClient } from "./rest";
import { toQueryString } from "./helpers";

let cacheTypes = {};
let cacheSchemas = {};
let cachePermissions = [];

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

  async getItems(path, start = 0, pageSize=10) {
    if (path.startsWith("/")) {
      path = path.slice(1);
    }
    const result = await this.rest.get(
      `${path}@search?depth=1&b_start=${start}&b_size=${pageSize}`
    );
    return await result.json();
  }

  async search(path, params, container = false, prepare = true, start = 0, pageSize=10) {
    if (path.startsWith("/")) {
      path = path.slice(1);
    }
    if (container) {
      path = getContainerFromPath(path);
    }
    let query = prepare ? toQueryString(params) : params;
    const url = `${path}@search?${query}&b_start=${start}&b_size=${pageSize}`;
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

  async post(path, data) {
    return await this.create(path, data);
  }

  async patch(path, data) {
    if (path.startsWith("/")) {
      path = path.substring(1);
    }
    return await this.rest.patch(path, data);
  }

  async upload(path, file) {
    if (path.startsWith("/")) {
      path = path.substring(1);
    }
    return await this.rest.upload(path, file);
  }

  async download(path) {
    if (path.startsWith("/")) {
      path = path.substring(1);
    }
    return await this.rest.get(path);
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

  async getAllPermissions(path) {
    if (!path.endsWith("/")) {
      path = `${path}/`;
    }
    const req = await this.rest.get(path + "@all_permissions");
    const resp = await req.json();
    const permissions = Array.from(new Set(extractPermissions(resp)));
    // permissions.sort()
    return permissions;
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

export const lightFileReader = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onloadend = e => {
      const fileData = btoa(e.target.result);
      resolve({
        filename: file.name,
        data: fileData,
        encoding: "base64",
        "content-type": file.type
      });
    };
  });
};

const extractPermissions = data => {
  let result = [];
  if (typeof data !== "object") {
  } else if (!Array.isArray(data) && data.permission) {
    result = result.concat([data.permission]);
  } else if (!Array.isArray(data)) {
    Object.keys(data).map(
      key => (result = result.concat(extractPermissions(data[key])))
    );
  } else if (Array.isArray(data)) {
    data.map(item => (result = result.concat(extractPermissions(item))));
  }
  return result;
};
