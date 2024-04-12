import { IndexSignature } from '../types/global'
import { stringToSlug } from './helpers'

export const formatDate = (str: string): string => {
  const d = new Date(str)
  const minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
  return `${d.getDate()}/${
    d.getMonth() + 1
  }/${d.getFullYear()} ${d.getHours()}:${minutes}`
}

export const get = <T>(
  obj: IndexSignature,
  path: string | string[],
  defValue: T
): T => {
  // If path is not defined or it has false value
  if (!path) return defValue
  // Check if path is string or array. Regex : ensure that we do not have '.' and brackets.
  // Regex explained: https://regexr.com/58j0k
  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)
  // Find value if exist return otherwise return undefined value;
  if (pathArray === null) return defValue

  return (pathArray.reduce((prevObj, key) => prevObj && prevObj[key], obj) ??
    defValue) as T
}

export function getNewId(id = '') {
  const suffix = '-copy-'
  const rgx = new RegExp(`($|${suffix}\\d*)`)

  return stringToSlug(id).replace(rgx, (r: string) => {
    const num = parseInt(r.replace(suffix, '') || '0')
    return `${suffix}${num + 1}`
  })
}

export function debounce<T extends unknown[], U>(
  callback: (...args: T) => PromiseLike<U> | U,
  wait: number
) {
  let timer: ReturnType<typeof setTimeout>

  return (...args: T): Promise<U> => {
    clearTimeout(timer)
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(callback(...args)), wait)
    })
  }
}
