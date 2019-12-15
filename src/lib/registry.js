import React from 'react'

import {ApplicationCtx} from '../views/application'
import {DatabaseCtx} from '../views/application'
import {ContainerCtx} from '../views/container'
import {FolderCtx} from '../views/folder'
import {ItemCtx} from '../views/item'
import {UsersCtx} from '../views/users'
import {UserCtx} from '../views/users'

import {RemoveItem} from '../actions/remove_item'
import {AddItem} from '../actions/add_item'

import {BaseForm} from '../forms/base'
import {UserForm} from '../forms/users'


function Dummy() {
  return <p>Dummy</p>
}

let actions = {
  'removeItem': RemoveItem,
  'addItem': AddItem,
}

let forms = {
  'UserManager': BaseForm,
  'GroupManager': BaseForm,
  'Folder': BaseForm,
  'Item': BaseForm,
  'User': UserForm,
  'Group': BaseForm
}


let registry = {
  views: {
    'Application': ApplicationCtx,
    'Database': DatabaseCtx,
    'Container': ContainerCtx,
    'UserManager': UsersCtx,
    'User': UserCtx,
    'GroupManager': FolderCtx,
    'Folder': FolderCtx,
    'Item': ItemCtx,
  },
  actions,
  forms
}



export const getComponent = (context) => {
  if (!context) return
  return registry.views[context["@type"]] || defaultComponent(context)
}

export const registerComponent = (context, Component) => {
  registry.views[context] = Component
}

export const defaultComponent = (context) => {
  return (context.is_folderish) ? FolderCtx : ItemCtx
}

export const getAction = (action) => {
  return registry.actions[action]
}

export const getForm = (type) => {
  return registry.forms[type]
}


export const withRegisterComponent = (type, key, Component) => {
  registry[type][key] = Component
  return Component
}
