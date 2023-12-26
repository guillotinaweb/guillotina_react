import React from 'react'

/* eslint jsx-a11y/anchor-is-valid: "off" */
export function Pagination({ current, total, doPaginate, pager }) {
  const maxPages = Math.ceil(total / pager)
  if (maxPages <= 1) {
    return null
  }

  return (
    <div>
      <p className="level-right has-text-grey is-size-7">
        <span className="has-text-black">{current + 1}</span>/
        <span className="has-text-black">{maxPages}</span>&nbsp;of&nbsp;
        <span className="has-text-black">{`${total} items`}</span>
      </p>
      <nav
        className="pagination is-size-7"
        role="navigation"
        aria-label="pagination"
      >
        <a
          className="pagination-previous is-small"
          disabled={current === 0}
          onClick={() => (current > 0 ? doPaginate(current - 1) : null)}
        >
          <span className="icon">
            <i className="fas fa-arrow-left"></i>
          </span>
        </a>
        <a
          className="pagination-next is-small"
          disabled={current >= maxPages - 1}
          onClick={() => doPaginate(current + 1)}
        >
          <span className="icon">
            <i className="fas fa-arrow-right"></i>
          </span>
        </a>
      </nav>
    </div>
  )
}
