import React from 'react'
import { classnames } from '../../lib/helpers'

export const Tag = ({
  name,
  onRemove,
  size = 'is-medium',
  color = 'is-warning',
}) => (
  <span className={classnames(['tag', color, size])} data-test={`tag-${name}`}>
    {name}
    {onRemove !== undefined && (
      <button className="delete is-small" onClick={() => onRemove()}></button>
    )}
  </span>
)
