import { useRef } from 'react'
import { GuillotinaSchemaProperty } from '../types/guillotina'

export const Permissions: string[] = [
  'guillotina.AddContent',
  'guillotina.ModifyContent',
  'guillotina.ViewContent',
  'guillotina.DeleteContent',
  'guillotina.AccessContent',
  'guillotina.SeePermissions',
  'guillotina.ChangePermissions',
  'guillotina.MoveContent',
  'guillotina.DuplicateContent',
  'guillotina.ReadConfiguration',
  'guillotina.RegisterConfigurations',
  'guillotina.WriteConfiguration',
  'guillotina.ManageAddons',
  'guillotina.swagger.View',
]

interface IConfig {
  DisabledTypes: string[]
  PageSize: number
  DelayActions: number
  Permissions: string[]
  SearchEngine: string
  SizeImages?: string[]
  icons?: string[]
  properties_default?: string[]
  properties_ignore_fields?: string[]
  fieldHaveDeleteButton: (schema: GuillotinaSchemaProperty) => boolean
}
export const Config: IConfig = {
  DisabledTypes: ['UserManager', 'GroupManager'],
  PageSize: 10,
  DelayActions: 200,
  Permissions: Permissions,
  SearchEngine: 'PostreSQL', // Elasticsearch
  fieldHaveDeleteButton: (schema) => {
    return (
      schema?.widget === 'file' ||
      schema?.widget === 'select' ||
      schema?.type === 'array'
    )
  },
}

let calculated = Object.assign({}, Config)

const addConfig = (additional: Partial<IConfig>, original: IConfig) => {
  const rest = Object.assign({}, original)
  Object.keys(additional).forEach((item) => {
    if (typeof Config[item] === 'object' && Array.isArray(Config[item])) {
      rest[item] = [].concat(Config[item], additional[item])
    } else if (typeof Config[item] === 'object') {
      rest[item] = Object.assign({}, Config[item], additional[item])
    } else {
      rest[item] = additional[item]
    }
  })
  return rest
}

export function useConfig(cfg = {}) {
  const ref = useRef<unknown>()
  if (cfg && !ref.current) {
    calculated = addConfig(cfg, calculated)
    ref.current = calculated
  }
  return calculated
}
