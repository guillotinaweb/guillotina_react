import React from 'react'

/* eslint jsx-a11y/anchor-is-valid: "off" */
export function Pagination({current, total, doPaginate, pager}) {

  const maxPages = Math.ceil(total/pager)
  if (maxPages <= 1) {
    return null
  }

  return (
    <nav className="pagination" role="navigation" aria-label="pagination">
      <a className="pagination-previous"
        disabled={current===0}
        onClick={() => doPaginate(current-1)}
        >Previous</a>
      <a className="pagination-next"
        disabled={current >= maxPages}
        onClick={() => doPaginate(current+1)}>Next page</a>
      {/* <ul className="pagination-list">
        <li>
          <a className="pagination-link" aria-label="Goto page 1">1</a>
        </li>
      </ul> */}
    </nav>
  )
}

