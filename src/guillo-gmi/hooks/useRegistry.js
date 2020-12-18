import { FolderCtx } from '../views/folder'
import { ItemCtx } from '../views/item'
import { ApplicationCtx } from '../views/application'
import { DatabaseCtx } from '../views/application'
import { ContainerCtx } from '../views/container'
import { UsersCtx } from '../views/users'
import { UserCtx } from '../views/users'
import { CopyItems } from '../actions/copy_items'
import { MoveItems } from '../actions/move_items'
import { RemoveItems } from '../actions/remove_items'
import { AddItem } from '../actions/add_item'
import { BaseForm } from '../forms/base'
import { UserForm } from '../forms/users'
import { IAttachment } from '../components/behaviors/iattachment'
import { IDublinCore } from '../components/behaviors/idublincore'
import { IMultiAttachment } from '../components/behaviors/imultiattachment'
import { GroupsCtx } from '../views/groups'
import { GroupCtx } from '../views/groups'
import ErrorBoundary from '../components/error_boundary'
import React from 'react'
import { NotAllowed } from '../components/notallowed'
import { NotFound } from '../components/notfound'
import { Path } from '../components/path'

let registry = {
  paths: {},
  views: {
    ErrorBoundary: ErrorBoundary,
    NotAllowed: NotAllowed,
    NotFound: NotFound,
    Application: ApplicationCtx,
    Database: DatabaseCtx,
    Container: ContainerCtx,
    UserManager: UsersCtx,
    User: UserCtx,
    Group: GroupCtx,
    GroupManager: GroupsCtx,
    Folder: FolderCtx,
    Item: ItemCtx,
  },
  actions: {
    addItem: AddItem,
    copyItems: CopyItems,
    moveItems: MoveItems,
    removeItems: RemoveItems,
  },
  forms: {
    UserManager: BaseForm,
    GroupManager: BaseForm,
    Folder: BaseForm,
    Item: BaseForm,
    User: UserForm,
    Group: BaseForm,
  },
  behaviors: {
    'guillotina.behaviors.dublincore.IDublinCore': IDublinCore,
    'guillotina.behaviors.attachment.IAttachment': IAttachment,
    'guillotina.behaviors.attachment.IMultiAttachment': IMultiAttachment,
  },
  schemas: {},
  properties: {},
  components: {
    Path: Path,
  },
}

const get = (key, param, fallback) => {
  if (registry[key]) return registry[key][param] || fallback
  return fallback
}

const getComponent = (context, path, fallback) => {
  if (!context) return
  // console.log("Component for path", path)
  // lookup by path
  if (registry.paths[path]) {
    return registry.paths[path]
  }
  // by type
  if (registry.views[context['@type']]) {
    return registry.views[context['@type']]
  }
  if (fallback) {
    return fallback
  }
  return defaultComponent(context)
}

const getForm = (type, fallback = BaseForm) => {
  return registry.forms[type] || fallback
}

const getAction = (type, fallback) => {
  return registry.actions[type] || fallback
}

const getBehavior = (type, fallback) => {
  return registry.behaviors[type] || fallback
}

const getProperties = (type) => {
  return registry.properties[type] || {}
}

export const defaultComponent = (context) => {
  return context.is_folderish ? FolderCtx : ItemCtx
}

export function useRegistry(data) {
  // if data is provided we need to merge it into actual registry
  const ref = React.useRef()
  if (data && !ref.current) {
    console.log('registry initialized')
    ref.current = true
    Object.keys(data).map(
      (key) => (registry[key] = { ...registry[key], ...data[key] })
    )
  }

  return {
    registry,
    get,
    getForm,
    getComponent,
    getAction,
    getBehavior,
    getProperties,
  }
}

/*

const registry = {
  paths: {
    "/db/guillotina/tags/": TagsContext
  },
  forms: {
    Tag: AddTagForm
  }
}


<guillotina registry={registry} />


*/
