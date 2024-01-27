export interface LightFile {
  filename: string
  data: ArrayBuffer | string
  'content-type': string
}

export interface IndexSignature<T = any> {
  [key: string]: T
}
