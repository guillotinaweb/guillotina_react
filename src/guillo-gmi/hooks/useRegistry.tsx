import { FolderCtx } from '../views/folder'
import { ItemCtx } from '../views/item'
import { ApplicationCtx } from '../views/application'
import { DatabaseCtx } from '../views/application'
import { ContainerCtx } from '../views/container'
import { UsersCtx } from '../views/users'
import { UserCtx } from '../views/users'
import { CopyItems } from '../actions/copy_items'
import { CopyItem } from '../actions/copy_item'
import { MoveItems } from '../actions/move_items'
import { MoveItem } from '../actions/move_item'
import { RemoveItems } from '../actions/remove_items'
import { RemoveItem } from '../actions/remove_item'
import { AddItem } from '../actions/add_item'
import { ChangePassword } from '../actions/change_pass'
import { BaseForm, BaseFormProps } from '../forms/base'
import { UserForm } from '../forms/users'
import { IAttachment } from '../components/behaviors/iattachment'
import { IDublinCore } from '../components/behaviors/idublincore'
import { IMultiAttachment } from '../components/behaviors/imultiattachment'
import { IImageAttachment } from '../components/behaviors/iimageattachment'
import { IMultiImageAttachment } from '../components/behaviors/imultiimageattachment'
import { IMultiImageOrderedAttachment } from '../components/behaviors/imultiimageorderedattachment'
import { IWorkflow } from '../components/behaviors/iworkflow'
import { GroupCtx, GroupsCtx } from '../views/groups'
import { ErrorBoundary } from '../components/error_boundary'
import React from 'react'
import { NotAllowed } from '../components/notallowed'
import { NotFound } from '../components/notfound'
import { Path } from '../components/path'
import { EditComponent } from '../components/fields/editComponent'
import { RenderFieldComponent } from '../components/fields/renderField'
import {
  GuillotinaCommonObject,
  ItemColumn,
  RegistrySchema,
} from '../types/guillotina'
import { buildQs, parser } from '../lib/search'
import { MessageDescriptor } from 'react-intl'
import { getActionsObject } from '../lib/helpers'

export interface RegistrySortValue {
  direction: 'asc' | 'des'
  key: string
}
export interface RegistryProperties {
  Buttons: React.ReactElement
  Panels: React.ReactElement
  default: string[]
  ignoreField: string[]
}
export interface IRegistry {
  paths: {
    [key: string]: React.FC
  }
  views: {
    [key: string]: React.ComponentType<any>
  }
  actions: {
    [key: string]: (props: any) => JSX.Element
  }
  forms: {
    [key: string]: (props: any) => JSX.Element
  }
  behaviors: {
    [key: string]: (props: any | undefined) => JSX.Element | null
  }
  itemsColumn: {
    [key: string]: () => ItemColumn[]
  }
  schemas: {
    [key: string]: RegistrySchema
  }
  properties: {
    [key: string]: RegistryProperties
  }
  components: {
    [key: string]: (props: any) => React.ReactNode | null | undefined
  }
  searchEngineQueryParamsFunction: {
    [key: string]: string
  }
  fieldsToFilter: {
    [key: string]: string[]
  }
  parseSearchQueryParamFunction: {
    [key: string]: (query: string, type: string) => string
  }
  defaultSortValue: {
    [key: string]: RegistrySortValue
  }
  actionsList: {
    [key: string]: (
      multiple: boolean
    ) => {
      [key: string]: {
        text: MessageDescriptor
        perms: string[]
        action: string
      }
    }
  }
}

const registry: IRegistry = {
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
    copyItem: CopyItem,
    moveItems: MoveItems,
    moveItem: MoveItem,
    removeItems: RemoveItems,
    changePassword: ChangePassword,
    removeItem: RemoveItem,
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
    'guillotina.contrib.image.behaviors.IImageAttachment': IImageAttachment,
    'guillotina.contrib.image.behaviors.IMultiImageAttachment': IMultiImageAttachment,
    'guillotina.contrib.image.behaviors.IMultiImageOrderedAttachment': IMultiImageOrderedAttachment,
    'guillotina.contrib.workflows.interfaces.IWorkflowBehavior': IWorkflow,
  },
  itemsColumn: {},
  schemas: {},
  properties: {},
  components: {
    Path: Path,
    EditComponent: EditComponent,
    RenderFieldComponent: RenderFieldComponent,
  },
  searchEngineQueryParamsFunction: {
    PostreSQL: 'getQueryParamsPostresql',
    Elasticsearch: 'getQueryParamsElasticsearch',
  },
  fieldsToFilter: {
    UserManager: ['id', 'email', 'user_name'],
  },
  parseSearchQueryParamFunction: {},
  defaultSortValue: {},
  actionsList: {},
}

export interface IManageRegistry {
  registry: IRegistry
  getPathComponent: (
    context: GuillotinaCommonObject | undefined,
    path: string,
    fallback?: React.FC
  ) => React.ComponentType<any>
  getComponent: (name: string) => React.ComponentType<any>
  getView: (name: string) => React.ComponentType<any>
  getForm: (type: string, fallback?: React.FC) => React.FC<BaseFormProps>
  getAction: (type: string, fallback?: React.FC) => React.FC
  getBehavior: (type: string, fallback?: React.FC) => React.FC<any>
  getProperties: (type: string) => RegistryProperties
  getItemsColumn: (type: string) => ItemColumn[] | undefined
  getSchemas: (type: string) => RegistrySchema
  getFieldsToFilter: (type: string, fallback?: string[]) => string[]
  getParsedSearchQueryParam: (query: string, type: string) => string
  getDefaultSortValue: (
    type: string,
    fallback?: RegistrySortValue
  ) => RegistrySortValue
  getSearchEngineQueryParamsFunction: (type: string) => string
  getActionsList: (
    type: string,
    multiple: boolean
  ) => {
    [key: string]: {
      text: MessageDescriptor
      perms: string[]
      action: string
    }
  }
}

const getPathComponent = (
  context: GuillotinaCommonObject | undefined,
  path: string,
  fallback: React.FC | undefined = undefined
) => {
  if (!context) return () => null
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

const getItemsColumn = (type: string) => {
  const funcCols = registry.itemsColumn[type]
  if (funcCols) {
    return funcCols()
  }
  return undefined
}

const getComponent = (name: string) => {
  return registry.components[name]
}

const getView = (name: string) => {
  return registry.views[name]
}

const getForm = (type: string, fallback?: React.FC<BaseFormProps>) => {
  return registry.forms[type] || fallback || BaseForm
}

const getAction = (type: string, fallback?: React.FC) => {
  return registry.actions[type] || fallback
}

const getBehavior = (type: string, fallback?: React.FC) => {
  return registry.behaviors[type] || fallback
}

const getProperties = (type: string) => {
  return registry.properties[type] || {}
}

const getSchemas = (type: string): RegistrySchema => {
  return registry.schemas[type] || {}
}

const getFieldsToFilter = (type: string, fallback: string[] = ['title']) => {
  return registry.fieldsToFilter[type] || fallback
}

const getDefaultSortValue = (
  type: string,
  fallback: RegistrySortValue | undefined = {
    key: 'id',
    direction: 'des',
  }
) => {
  return registry.defaultSortValue[type] || fallback
}

const getSearchEngineQueryParamsFunction = (type: string) => {
  return registry.searchEngineQueryParamsFunction[type]
}

const getParsedSearchQueryParam = (query: string, type: string) => {
  const parsedFunction = registry.parseSearchQueryParamFunction[type]
  if (!parsedFunction) {
    const fieldsToFilter = getFieldsToFilter(type)
    return buildQs(parser(query, fieldsToFilter))
  }
  return parsedFunction(query, type)
}

const getActionsList = (
  type: string,
  multiple: boolean
): {
  [key: string]: {
    text: MessageDescriptor
    perms: string[]
    action: string
  }
} => {
  const funcActionsList = registry.actionsList[type]
  if (funcActionsList) {
    return funcActionsList(multiple)
  }
  return getActionsObject(multiple)
}

export const defaultComponent = (context: GuillotinaCommonObject) => {
  return context.is_folderish ? FolderCtx : ItemCtx
}

export function useRegistry(data: Partial<IRegistry>): IManageRegistry {
  // if data is provided we need to merge it into actual registry
  const ref = React.useRef<unknown>()
  if (data && !ref.current) {
    ref.current = true
    Object.keys(data).map((key) => {
      const registryKey = key as keyof IRegistry
      registry[registryKey] = {
        ...registry[registryKey],
        ...data[registryKey],
      } as any
    })
  }

  return {
    registry,
    getForm,
    getComponent,
    getPathComponent,
    getAction,
    getBehavior,
    getProperties,
    getItemsColumn,
    getFieldsToFilter,
    getParsedSearchQueryParam,
    getDefaultSortValue,
    getSchemas,
    getView,
    getSearchEngineQueryParamsFunction,
    getActionsList,
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
