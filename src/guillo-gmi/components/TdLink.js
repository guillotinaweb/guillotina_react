import React from 'react'
import { useLocation } from '../hooks/useLocation'

export function TdLink({ model, children, ...props }) {
  const [path, navigate] = useLocation()
  const aStyle = { textDecoration: 'none', color: 'currentColor' }

  function onClick(e) {
    if (actAsLink(e)) return
    e.preventDefault()
    navigate({ path: model.path }, true)
    if (props.onClick) props.onClick(e)
  }

  return (
    <td {...props} onClick={onClick}>
      <a href={`?${path}${model.id}/`} style={aStyle} onClick={onClick}>
        {children}
      </a>
    </td>
  )
}

function actAsLink(e) {
  return e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0
}
