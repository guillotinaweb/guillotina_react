
import {formatDate} from '../lib/utils'

export class ItemModel {
  constructor(item, url, path) {
    this.item = item
    this.url = url
    this._path = path
    console.log(item)
  }

  get path() {
    if (this.item.path) {
      let parts = this.item.path.slice(1).split("/")
      return this._path + parts[parts.length-1] + "/"
    }
    return `${this._path}${this.id}/`
  }

  get name() {
    return this.item["@name"]
  }

  get icon() {
    switch(this.type) {
      case "GroupManager":
        return "fas fa-users-cog"
      case "UserManager":
        return "fas fa-user-cog"
      case "User":
        return "fas fa-user"
      case "Group":
        return "fas fa-users"
      case "Folder":
        return "fas fa-folder"
      default:
        return "fas fa-file"
    }
  }

  get fullPath() {
    return this._url + this.item.id
  }

  get id() {
    if (this.item.id) {
      return this.item.id
    }
    let id = this.item["@id"].split("&")[0].split("/")
    return id[id.length-1]
  }

  get uid() {
    return this.item["@uid"]
  }

  get type() {
    return this.item["@type"] || this.item.type_name
  }

  get title() {
    return this.item.title
  }

  get created() {
    return (this.item.creation_date) ?
      formatDate(this.item.creation_date) : ''
  }

  get updated() {
    return (this.item.modification_date) ?
      formatDate(this.item.modification_date) : ''
  }


}
