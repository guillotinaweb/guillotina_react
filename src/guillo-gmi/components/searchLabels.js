import React from 'react'
import { Tag } from './ui/tag'
import { useLocation } from '../hooks/useLocation'

export function SearchLabels(props) {
  const [location, , del] = useLocation()
  const search = location.get('q')

  const clearSearch = () => {
    del('q')
  }

  return (
    <div className="tags">
      {search && <Tag name="Search:" color="is-light" size="is-size-7" />}
      {search && (
        <Tag
          name={search}
          color="is-info"
          size="is-size-7"
          onRemove={() => clearSearch()}
        />
      )}
    </div>
  )
}
