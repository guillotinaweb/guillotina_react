export type FileWithFileName = {
  filename: string
} & File

export interface IndexSignature<T = any> {
  [key: string]: T
}
