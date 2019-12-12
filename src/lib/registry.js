import React from 'react'

import {ApplicationCtx} from '../views/application'
import {DatabaseCtx} from '../views/application'
import {ContainerCtx} from '../views/container'
import {FolderCtx} from '../views/items'
import {ItemCtx} from '../views/items'
import {UsersCtx} from '../views/users'
import {UserCtx} from '../views/users'

import {RemoveItem} from '../actions/remove_item'
import {AddItem} from '../actions/add_item'

import {BaseForm} from '../forms/base'
import {AddUserForm} from '../forms/users'


function Dummy() {
  return <p>Dummy</p>
}


let registry = {
  'Application': ApplicationCtx,
  'Database': DatabaseCtx,
  'Container': ContainerCtx,
  'UserManager': UsersCtx,
  'User': UserCtx,
  'GroupManager': FolderCtx,
  'Folder': FolderCtx,
  'Item': ItemCtx,
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
  'User': AddUserForm,
}

export const getComponent = (context) => {
  if (!context) return
  return registry[context["@type"]] || defaultComponent(context)
}

export const registerComponent = (context, Component) => {
  registry[context] = Component
}

export const defaultComponent = (context) => {
  return (context.is_folderish) ? FolderCtx : ItemCtx
}

export const getAction = (action) => {
  return actions[action]
}

export const getForm = (type) => {
  return forms[type]
}
