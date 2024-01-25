import { useEffect, useState } from 'react'
import { Tag } from './ui/tag'
import { useLocation } from '../hooks/useLocation'
import { useVocabulary } from '../hooks/useVocabulary'
import { get } from '../lib/utils'

interface Props {
  query?: string
  vocabularyName?: string
}

export function SearchVocabularyLabels({ query = 'q', vocabularyName }: Props) {
  const [location, , del] = useLocation()
  const [renderValue, setRenderValue] = useState(undefined)
  const vocabulary = useVocabulary(vocabularyName)
  const defaultRenderValue = location.get(query)

  useEffect(() => {
    let value = defaultRenderValue
    if (get(vocabulary, 'data.items', []).length > 0) {
      const vocabularyValue = get(vocabulary, 'data.items', []).find(
        (item) => item.token === value
      )
      if (vocabularyValue) {
        value = vocabularyValue.title
      }
    }
    setRenderValue(value)
  }, [vocabulary, defaultRenderValue])

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
