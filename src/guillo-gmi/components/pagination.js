import React from 'react'
import { useIntl } from 'react-intl'

/* eslint jsx-a11y/anchor-is-valid: "off" */
export function Pagination({ current, total, doPaginate, pager }) {
  const intl = useIntl()
  const maxPages = Math.ceil(total / pager)
  if (maxPages <= 1) {
    return null
  }

  return (
    <div>
      <p className="level-right has-text-grey is-size-7">
        <span>
          {intl.formatMessage(
            {
              id: 'pagination',
              defaultMessage:
                '{currentPage} / {totalPages} of {totalItems} items',
            },
            {
              currentPage: current + 1,
              totalPages: maxPages,
              totalItems: total,
            }
          )}
        </span>
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
