import React from 'react';
import {TraversalContext} from '../contexts'
import {useContext} from 'react'

/* eslint jsx-a11y/anchor-is-valid: "off" */

export function Path(props) {

  const ctx = useContext(TraversalContext)

  let segments = ctx.path.replace(/\/$/, "").split("/")
  let links = buildPaths(segments)

  if (segments.length === 1) {
    return false
  }

  return (
    <nav className="breadcrumb" aria-label="breadcrumbs">
      <ul>
      {segments.map((item, indx) =>
        (indx === 0) ?
          <li key={indx}>
            <a onClick={() => ctx.setPath(links[indx])}>
              <span className="icon">
                <i className="fas fa-home"></i>
              </span>
            </a>
          </li>
          :
          <li key={indx}><a onClick={() => ctx.setPath(links[indx])}>
          {item}</a></li>
      )}
      </ul>
    </nav>
  )

}

const buildPaths = (segments) => {
  let current = ""
  let results = []
  segments.map((item, indx) => {
    if (indx === 0) {
      current += "/"
    } else {
      current += item + "/"
    }
    results.push(current)
  })
  return results
}
