import { useEffect, useState } from 'react'
import { Tag } from './ui/tag'
import { useLocation } from '../hooks/useLocation'

interface Props {
  query?: string
  options?: { value: string; text: string }[]
}
export function SearchOptionsLabels({ query = 'q', options }: Props) {
  const [location, , del] = useLocation()
  const [renderValue, setRenderValue] = useState<string | undefined>(undefined)
  const defaultRenderValue = location.get(query) || ''

  useEffect(() => {
    let value = defaultRenderValue
    if (options && (options ?? []).length > 0) {
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
