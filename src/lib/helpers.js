

export const classnames = (classNames) => {
  return classNames
      .filter(Boolean)
      .join(' ')
      .trim();
};

export const noop = () => {}


let current = 0;

export const generateUID = (prefix) => `${prefix || 'id'}-${current++}`;
