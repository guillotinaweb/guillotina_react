type ItemsPropertyObject = {
  '@id': string
  '@name': string
  '@type': string
  '@uid': string
}

export interface GuillotinaSchema {
  title: string
  $schema: string
  type: string
  required: string[]
  definitions: Definitions
  properties: GuillotinaSchemaProperties
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

export interface Items {
  type: string
  widget?: string
  properties?: GuillotinaSchemaProperties
  vocabulary?: string[]
  vocabularyName?: string
}
export interface GuillotinaSchemaProperty {
  type: string
  title: string
  widget?: string
  readonly?: boolean
  description?: string
  vocabularyName?: string
  vocabulary?: string[]
  items?: Items
  properties: GuillotinaSchemaProperties
  additionalProperties: GuillotinaSchemaProperties
  typeNameQuery?: string
  labelProperty?: string
}
export interface GuillotinaSchemaProperties {
  [key: string]: GuillotinaSchemaProperty | { $ref: string }[]
}

export type GuillotinaCommonObject = {
  creation_date: Date
  modification_date: string
  title: string
  type_name: string
  uuid: string
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
} & ItemsPropertyObject
