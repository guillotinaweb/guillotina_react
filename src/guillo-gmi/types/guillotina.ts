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
  items?: GuillotinaSchemaProperty
  properties?: GuillotinaSchemaProperties
  additionalProperties?: GuillotinaSchemaProperties
  typeNameQuery?: string
  labelProperty?: string
  enum?: string[]
  queryCondition?: string
  queryPath?: string
}

interface GuillotinaParentObject {
  '@id': string
  '@name': string
  '@type': string
  '@uid': string
}
export type GuillotinaCommonObject = {
  creation_date: string
  modification_date: string
  title: string
  type_name: string
  uuid: string
  is_folderish: boolean
  parent: GuillotinaParentObject
  length: number
  __behaviors__?: string[]
  'guillotina.behaviors.dublincore.IDublinCore'?: IBehaviorDublinCore
  'guillotina.contrib.workflows.interfaces.IWorkflowBehavior'?: {
    review_state: string
  }
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

export interface Workflow {
  '@id': string
  history: History[]
  transitions: Transition[]
}

export interface History {
  actor: string
  comments: string
  time: string
  title: string
  type: string
  data: Data
}

export interface Data {
  action: null
  review_state: string
}

export interface Transition {
  '@id': string
  title: string
  metadata: IndexSignature
}

export interface Addons {
  available: AddonAvailable[]
  installed: string[]
}

export interface AddonAvailable {
  id: string
  title: string
  dependencies: any[]
}

export interface RegistrySchema {
  filters: RegistrySchemaFilter[]
}

export interface RegistrySchemaFilter {
  attribute_key: string
  label: string
  type: string
  values?: { value: string; text: string }[]
  vocabulary?: string
  input_type?: string
}

export type ReturnSearch<T> = {
  items: T[]
  items_total: number
}

export type ReturnSearchCompatible<T> = {
  member: T[]
  items_count: number
  items: T[]
  items_total: number
}

export interface ItemColumn {
  label: string
  key: string
  isSortable?: boolean
  child: React.ReactNode
}

export type GuillotinaUser = {
  user_roles: string[]
  user_groups: string[]
  user_permissions: string[]
  fullname: string
  email: string
  username: string
} & GuillotinaCommonObject

export type GuillotinaGroup = {
  user_roles: string[]
  users: string[]
} & GuillotinaCommonObject

export type GuillotinaApplication = {
  databases: string[]
} & GuillotinaCommonObject

export type GuillotinaDatabase = {
  containers: string[]
} & GuillotinaCommonObject
