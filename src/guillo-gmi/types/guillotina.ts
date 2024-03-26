import { IndexSignature } from './global'

type ItemsPropertyObject = {
  '@id': string
  '@name': string
  '@type': string
  '@uid': string
  '@absolute_url': string
  __behaviors__: string[]
  '@static_behaviors': string[]
}

export interface IBehaviorDublinCore {
  title: string
  description: string | null
  creation_date: string
  modification_date: string
  effective_date: string | null
  expiration_date: string | null
  creators: string[]
  tags: string[] | null
  publisher: string | null
  contributors: string[]
}
export interface GuillotinaSchema {
  title: string
  $schema: string
  type: string
  required: string[]
  definitions: Definitions
  properties: GuillotinaSchemaProperties
}

export interface GuillotinaSchemaProperties {
  [key: string]: GuillotinaSchemaProperty | { $ref: string }[]
}

export interface Definitions {
  [key: string]: {
    type: string
    properties: GuillotinaSchemaProperties
    required: string[]
    title: string
    description: string
  }
}

export interface GuillotinaSchemaProperty {
  type: string
  title: string
  widget?: string
  readonly?: boolean
  description?: string
  vocabularyName?: string
  vocabulary?: string[]
  items?: GuillotinaItemsProperty
  properties?: GuillotinaSchemaProperties
  additionalProperties?: GuillotinaSchemaProperties
  typeNameQuery?: string
  labelProperty?: string
  enum?: string[]
}

export interface GuillotinaItemsProperty {
  type: string
  widget?: string
  properties?: GuillotinaSchemaProperties
  vocabulary?: string[]
  vocabularyName?: string
  queryCondition?: string
  queryPath?: string
  labelProperty?: string
  typeNameQuery?: string
  items: GuillotinaItemsProperty
  title: string
  enum?: string[]
}

interface GuillotinaParentObject {
  '@id': string
  '@name': string
  '@type': string
  '@uid': string
}
export type GuillotinaCommonObject = {
  creation_date: Date
  modification_date: string
  title: string
  type_name: string
  uuid: string
  is_folderish: boolean
  parent: GuillotinaParentObject
  __behaviors__?: string[]
  'guillotina.behaviors.dublincore.IDublinCore'?: IBehaviorDublinCore
  'guillotina.behaviors.attachment.IAttachment'?: {
    file: GuillotinaFile
  }
  'guillotina.behaviors.attachment.IMultiAttachment'?: {
    files: {
      [key: string]: GuillotinaFile
    }
  }
} & ItemsPropertyObject

export type GuillotinaFile = {
  filename: string
  content_type: string
  extension: string
  size: number
  md5: string
}

export type SearchItem = {
  id: string
  parent_uuid: string
  path: string
  tid: string
  uuid: string
  title: string
  type_name: string
  creation_date: string
  modification_date: string
} & ItemsPropertyObject

export interface GuillotinaVocabulary {
  '@id': string
  items: GuillotinaVocabularyItem[]
  items_total: number
}

export interface GuillotinaVocabularyItem {
  title: string
  token: string
}
export interface GuillotinaSharing {
  local: GuillotinaSharingMap
  inherit: GuillotinaSharingInheritItem[]
}

export interface GuillotinaSharingInheritItem extends GuillotinaSharingMap {
  '@id': string
}
export interface GuillotinaSharingMap {
  roleperm: {
    [key: string]: IndexSignature<string>
  }
  prinperm: {
    [key: string]: IndexSignature<string>
  }
  prinrole: {
    [key: string]: IndexSignature<string>
  }
}

export interface GuillotinaBehaviors {
  static: string[]
  dynamic: string[]
  available: string[]
}

export interface AllPermissions {
  [key: string]: AllPermissionsItem
}

export interface AllPermissionsItem {
  prinperm?: PrimPerm[]
  prinrole?: Prinrole[]
  roleperm?: Roleperm[]
  perminhe?: Perminhe[]
}

export interface Prinrole {
  principal: string
  role: string
  setting: Setting
}

export interface Roleperm {
  permission: string
  role: string
  setting: Setting
}
export interface PrimPerm {
  principal: string
  permission: string
  setting: Setting
}
export interface Perminhe {
  permission: string
  setting: Setting
}

export enum Setting {
  Allow = 'Allow',
  AllowSingle = 'AllowSingle',
  Deny = 'Deny',
  Unset = 'Unset',
}

export interface GuillotinaGroups {
  '@name': string
  id: string
  title: null
  users: string[]
  roles: string[]
}

export interface GuillotinaUser {
  '@name': string
  id: string
  fullname: string
  email: string
  roles: string[]
}
