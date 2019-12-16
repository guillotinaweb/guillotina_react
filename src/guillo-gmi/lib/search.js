


/*
text -> name=text
text word -> name=text name=word
text=asdf nombre=xxx ->

*/

const SEP="="
const DEFAULT_FIELD = "title__in"


export function parser(qs, defaultField=DEFAULT_FIELD) {
  let lastKey = undefined
  qs.trim()
  qs = qs.split(" ")
  return qs.map(part => {
    if (!part.includes(SEP)) {
        return !lastKey ? [defaultField, part] : [lastKey, part]
    }
    const [key, val] = part.split(SEP)
    lastKey = key
    return [key, val]
  })
}


export function buildQs(parsedQuery) {
  return parsedQuery.map(
    ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
  ).join("&")

}
