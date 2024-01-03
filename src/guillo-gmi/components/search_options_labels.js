import React, { useEffect, useState } from 'react'
import { Tag } from './ui/tag'
import { useLocation } from '../hooks/useLocation'

export function SearchOptionsLabels(props) {
  const { query = 'q', options } = props
  const [location, , del] = useLocation()
  const [renderValue, setRenderValue] = useState(undefined)
  const defaultRenderValue = location.get(query)

  useEffect(() => {
    let value = defaultRenderValue
    if ((options ?? []).length > 0) {
      const option = options.find((item) => item.value === value)
      if (option) {
        value = option.text
      }
    }
    setRenderValue(value)
  }, [defaultRenderValue])

  const clearSearch = () => {
    del(query)
  }

  if (renderValue) {
    return (
      <div className="tags">
        <Tag
          id={defaultRenderValue}
          name={renderValue}
          color="is-info"
          size="is-size-7"
          onRemove={() => clearSearch()}
        />
      </div>
    )
  }
  return null
}
