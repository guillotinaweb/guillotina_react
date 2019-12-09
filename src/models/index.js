

export class ItemModel {
  constructor(item) {
   this.item = item
  }

  get path() {
    const noHttp = this.item["@id"].split("//")
    let parts = noHttp[1].split("/")
    parts.shift()
    return `/${parts.join("/")}/`
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
      case "Folder":
        return "fas fa-folder"
      default:
        return "fas fa-file"
    }
  }

  get uid() {
    return this.item["@uid"]
  }

  get type() {
    return this.item["@type"]
  }

  get title() {
    return this.item.title
  }

}
