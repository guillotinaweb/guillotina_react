const SEP = "=";
const DEFAULT_FIELD = "title__in";
const CLEANER = "||";

export function parser(qs, defaultField = DEFAULT_FIELD) {
  let lastKey = undefined;
  qs.trim();

  if (qs.includes('"')) {
    qs = qs.replace(/"(\w+) (\w+)"/, `$1${CLEANER}$2`);
  }

  qs = qs.split(" ");
  return qs.map(part => {
    if (part.includes(CLEANER)) {
      part = part.replace("||", " ");
    }
    if (!part.includes(SEP)) {
      return !lastKey ? [defaultField, part] : [lastKey, part];
    }
    const [key, val] = part.split(SEP);
    lastKey = key;
    return [key, val];
  });
}

export function buildQs(parsedQuery) {
  return parsedQuery
    .map(
      ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
    )
    .join("&");
}
