import { formatDate } from '../lib/utils'
import { useConfig } from '../hooks/useConfig'
import { GuillotinaCommonObject, SearchItem } from '../types/guillotina'

export * from './sharing'

export class ItemModel {
  item: SearchItem | GuillotinaCommonObject
  constructor(item: SearchItem | GuillotinaCommonObject) {
    this.item = item
  }

  get path() {
    if ('path' in this.item) {
      return `${this.item.path}/`
    }
    // Compat
    const itemId: string = this.item['@id']
      ? this.item['@id']
      : this.item['@absolute_url']
    const path = itemId.split('//')[1].split('/').splice(3).join('/')

    return `/${path}/`
  }

  get name() {
    return this.item.title || this.item['@name']
  }

  get icon() {
    const cfg = useConfig()
    if (cfg.icons && cfg.icons[this.type]) {
      return cfg.icons[this.type]
    }

    switch (this.type) {
      case 'GroupManager':
        return 'fas fa-users-cog'
      case 'UserManager':
        return 'fas fa-user-cog'
      case 'User':
        return 'fas fa-user'
      case 'Group':
        return 'fas fa-users'
      case 'Folder':
        return 'fas fa-folder'
      default:
        return 'fas fa-file'
    }
  }

  get fullPath() {
    return this.item['@id']
  }

  get id() {
    if ('id' in this.item) {
      return this.item.id
    }
    const id = this.item['@id'].split('&')[0].split('/')
    return id[id.length - 1]
  }

  get uid() {
    return this.item['@uid']
  }

  get type(): string {
    return this.item['@type'] || this.item.type_name
  }

  get title() {
    return this.item.title
  }

  get created() {
    return this.item.creation_date ? formatDate(this.item.creation_date) : ''
  }

  get updated() {
    return this.item.modification_date
      ? formatDate(this.item.modification_date)
      : ''
  }
}
