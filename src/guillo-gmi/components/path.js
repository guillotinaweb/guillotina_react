import React from 'react';
import {TraversalContext} from '../contexts'
import {useContext} from 'react'
import {useLocation} from '../hooks/useLocation'

/* eslint jsx-a11y/anchor-is-valid: "off" */

export function Path(props) {

  const ctx = useContext(TraversalContext)
  const [, navigate] = useLocation()

  let segments = ctx.path.replace(/\/$/, "").split("/")
  let links = buildPaths(segments)

  if (segments.length === 1) {
    return false
  }
  //ctx.setPath(links[indx])
  return (
    <nav className="breadcrumb" aria-label="breadcrumbs">
      <ul>
      {segments.map((item, indx) =>
        ((indx === 0) ?
          <li key={indx}>
            <a onClick={() => navigate({path:links[indx]}, true)}>
              <span className="icon">
                <i className="fas fa-home"></i>
              </span>
            </a>
          </li>
          :
          <li key={indx}><a onClick={() => navigate({path:links[indx]}, true)}>
          {item}</a></li>
      ))}
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
    return item
  })
  return results
}
