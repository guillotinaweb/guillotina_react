const SEP = '='
const DEFAULT_FIELD = 'title__in'
const CLEANER = '||'

export function parser(qs: string, defaultField = DEFAULT_FIELD): string[][] {
  if (qs.includes(SEP) && Array.isArray(defaultField)) {
    throw new Error('This option is not supported')
  }

  if (Array.isArray(defaultField)) {
    const orParser: string[] = []
    defaultField.forEach((field) => {
      const parsed = parser(qs, field)
      orParser.push(buildQs(parsed))
    })
    const result = [['__or', orParser.join('&')]]
    return result
  }
  let lastKey: string | undefined = undefined
  qs.trim()

  if (qs.includes('"')) {
    qs = qs.replace(/"(\w+) (\w+)"/, `$1${CLEANER}$2`)
  }

  const qsSplit = qs.split(' ')
  return qsSplit.map((part) => {
    if (part.includes(CLEANER)) {
      part = part.replace('||', ' ')
    }
    if (!part.includes(SEP)) {
      return !lastKey ? [defaultField, part] : [lastKey, part]
    }
    const [key, val] = part.split(SEP)
    lastKey = key
    return [key, val]
  })
}

export function buildQs(parsedQuery: string[][]): string {
  return parsedQuery
    .map(
      ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
    )
    .join('&')
}
