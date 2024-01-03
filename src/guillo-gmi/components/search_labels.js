import React from 'react'
import { Tag } from './ui/tag'
import { useLocation } from '../hooks/useLocation'

export function SearchLabels(props) {
  const { query } = props
  const [location, , del] = useLocation()
  const search = location.get(query ?? 'q')

  const clearSearch = () => {
    del(query ?? 'q')
  }

  if (search) {
    return (
      <div className="tags">
        <Tag
          id={search}
          name={search}
          color="is-info"
          size="is-size-7"
          onRemove={() => clearSearch()}
        />
      </div>
    )
  }
  return null
}
