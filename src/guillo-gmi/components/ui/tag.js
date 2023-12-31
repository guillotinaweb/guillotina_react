import React from 'react'
import { classnames } from '../../lib/helpers'

export const Tag = ({
  name,
  id,
  onRemove,
  size = 'is-medium',
  color = 'is-warning',
}) => (
  <span className={classnames(['tag', color, size])} data-test={`tag-${id}`}>
    {name}
    {onRemove !== undefined && (
      <button className="delete is-small" onClick={() => onRemove()}></button>
    )}
  </span>
)
