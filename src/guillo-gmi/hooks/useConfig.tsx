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
  icons?: { [key: string]: string }
  properties_default?: string[]
  properties_ignore_fields?: string[]
  fieldHaveDeleteButton: (schema: GuillotinaSchemaProperty) => boolean
}

export const defaultConfig: IConfig = {
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

let calculated = Object.assign({}, defaultConfig)

function addConfig(updates: Partial<IConfig>, currentConfig: IConfig): IConfig {
  const updatedConfig: Partial<IConfig> = { ...currentConfig }

  Object.entries(updates).forEach(([key, value]) => {
    const currentKey = key as keyof IConfig
    const currentValue = currentConfig[currentKey]

    if (Array.isArray(value) && Array.isArray(currentValue)) {
      // Correctly type the array concatenation
      updatedConfig[currentKey] = [...currentValue, ...value] as any
    } else if (isPlainObject(value) && isPlainObject(currentValue)) {
      // Correctly type the object merging
      updatedConfig[currentKey] = { ...currentValue, ...value } as any
    } else {
      // Directly assign all other types
      updatedConfig[currentKey] = value as any
    }
  })

  return updatedConfig as IConfig
}

// Helper function to check if a value is a plain object (and not a React node, etc.)
function isPlainObject(value: any): value is object {
  return Object.prototype.toString.call(value) === '[object Object]'
}

export function useConfig(cfg = {}) {
  const ref = useRef<IConfig>()
  if (cfg && !ref.current) {
    calculated = addConfig(cfg, calculated)
    ref.current = calculated
  }
  return calculated
}
