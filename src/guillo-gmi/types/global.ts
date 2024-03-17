import { GuillotinaFile } from './guillotina'

export interface LightFile {
  filename: string
  data: ArrayBuffer | string
  'content-type': string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IndexSignature<T = any> {
  [key: string]: T
}

export type EditableFieldValue =
  | GuillotinaFile
  | LightFile
  | IndexSignature
  | string
  | string[]
  | boolean
  | Date
  | undefined
  | null
