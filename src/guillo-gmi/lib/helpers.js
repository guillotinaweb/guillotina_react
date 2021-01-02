export const classnames = (classNames) => {
  return classNames.filter(Boolean).join(' ').trim()
}

export const noop = () => {}

let current = 0

export const generateUID = (prefix) => `${prefix || 'id'}-${current++}`

export const toQueryString = (params) => {
  return Object.keys(params)
    .map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
    })
    .join('&')
}

export function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64)
  const binaryLen = binaryString.length
  const bytes = new Uint8Array(binaryLen)
  for (var i = 0; i < binaryLen; i++) {
    var ascii = binaryString.charCodeAt(i)
    bytes[i] = ascii
  }
  return bytes
}

export function stringToSlug(str) {
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
  var to = 'aaaaeeeeiiiioooouuuunc------'
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes

  return str
}

export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(function () {
      resolve()
    }, ms)
  })
}
