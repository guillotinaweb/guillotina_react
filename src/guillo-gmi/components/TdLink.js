import React, { useRef } from 'react'
import { Link } from './Link'

export function TdLink({ model, children, ...props }) {
  const link = useRef()

  function onClick() {
    link.current.click()
  }

  return (
    <td {...props} onClick={onClick}>
      <Link model={model} aRef={link}>
        {children}
      </Link>
    </td>
  )
}
