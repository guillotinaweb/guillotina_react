import React from 'react'
import { useLocation } from '../hooks/useLocation'

export function Link({ aRef, model, children, ...props }) {
  const [path, navigate] = useLocation()
  const aStyle = { textDecoration: 'none', color: 'currentColor' }

  function onClick(e) {
    e.stopPropagation()
    if (actAsLink(e)) return
    e.preventDefault()
    navigate({ path: model.path }, true)
    if (props.onClick) props.onClick(e)
  }

  return (
    <a
      {...props}
      ref={aRef}
      href={`?${path}${model.id}/`}
      style={aStyle}
      onClick={onClick}
    >
      {children}
    </a>
  )
}

function actAsLink(e) {
  return e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0
}
