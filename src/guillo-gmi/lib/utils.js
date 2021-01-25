export const formatDate = (str) => {
  const d = new Date(str)
  const minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
  return `${d.getDate()}/${
    d.getMonth() + 1
  }/${d.getFullYear()} ${d.getHours()}:${minutes}`
}

export function getNewId(id = '') {
  const suffix = '-copy-'
  const rgx = new RegExp(`($|${suffix}\\d*)`)

  return id.replace(rgx, (r) => {
    const num = parseInt(r.replace(suffix, '') || '0')
    return `${suffix}${num + 1}`
  })
}
