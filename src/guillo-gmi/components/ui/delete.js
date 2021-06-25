import React from 'react'

export function Delete({ onClick, className, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`delete ${className}`}
      data-test="btnDeleteTest"
    >
      {children}
    </button>
  )
}
