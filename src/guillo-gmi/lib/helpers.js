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
