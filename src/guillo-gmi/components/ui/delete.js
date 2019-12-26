import React from 'react'

export function Delete({ onClick, children }) {
  return (<button type="button"
    onClick={onClick} className="delete">
      {children}</button>
  );
}
