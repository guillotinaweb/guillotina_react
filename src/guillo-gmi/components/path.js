import React from 'react'
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
      {segments.map((item, indx) => {
          const path = links[indx]
          const onClick = (e) => {
            if (window.event.ctrlKey || window.event.metaKey) return
            e.preventDefault()
            navigate({ path }, true)
          }

          return indx === 0 ? (
            <li key={indx}>
              <a href={path} onClick={onClick}>
                <span className="icon">
                  <i className="fas fa-home"></i>
                </span>
              </a>
            </li>
          ) : (
            <li key={indx}>
              <a href={path} onClick={onClick}>
                {item}
              </a>
            </li>
          )
        })}
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
