export const classnames = classNames => {
  return classNames
    .filter(Boolean)
    .join(" ")
    .trim();
};

export const noop = () => {};

let current = 0;

export const generateUID = prefix => `${prefix || "id"}-${current++}`;

export const toQueryString = params => {
  return Object.keys(params)
    .map(key => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
    .join("&");
};


export function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const binaryLen = binaryString.length;
  const bytes = new Uint8Array(binaryLen);
  for (var i = 0; i < binaryLen; i++) {
     var ascii = binaryString.charCodeAt(i);
     bytes[i] = ascii;
  }
  return bytes;
}
