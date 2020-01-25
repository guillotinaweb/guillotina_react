import { formatDate } from "../lib/utils";
export * from './sharing'

export class ItemModel {
  constructor(item, url, path) {
    this.item = item;
    this.url = url;
    this._path = path;
  }

  get path() {
    // Compat
    let item = (this.item["@id"]) ? this.item["@id"] : this.item["@absolute_url"]
    let path = item.split("//")[1].split("/").splice(1).join("/")
    path = `/${path}/`
    if (this.url.length > 0) {
      if (this.url.startsWith("/")) {
        path = path.replace(this.url.substring(1), "")
      } else {
        path = path.replace(this.url, "")
      }
    }

    return path
  }

  get name() {
    return this.item["@name"];
  }

  get icon() {
    switch (this.type) {
      case "GroupManager":
        return "fas fa-users-cog";
      case "UserManager":
        return "fas fa-user-cog";
      case "User":
        return "fas fa-user";
      case "Group":
        return "fas fa-users";
      case "Folder":
        return "fas fa-folder";
      default:
        return "fas fa-file";
    }
  }

  get fullPath() {
    return this._url + this.item.id;
  }

  get id() {
    if (this.item.id) {
      return this.item.id;
    }
    let id = this.item["@id"].split("&")[0].split("/");
    return id[id.length - 1];
  }

  get uid() {
    return this.item["@uid"];
  }

  get type() {
    return this.item["@type"] || this.item.type_name;
  }

  get title() {
    return this.item.title;
  }

  get created() {
    return this.item.creation_date ? formatDate(this.item.creation_date) : "";
  }

  get updated() {
    return this.item.modification_date
      ? formatDate(this.item.modification_date)
      : "";
  }
}

export const Permissions = [
  "guillotina.AddContent",
  "guillotina.ModifyContent",
  "guillotina.ViewContent",
  "guillotina.DeleteContent",
  "guillotina.AccessContent",
  "guillotina.SeePermissions",
  "guillotina.ChangePermissions",
  "guillotina.MoveContent",
  "guillotina.ReadConfiguration",
  "guillotina.RegisterConfigurations",
  "guillotina.WriteConfiguration",
  "guillotina.ManageAddons",
  "guillotina.swagger.View",
];
