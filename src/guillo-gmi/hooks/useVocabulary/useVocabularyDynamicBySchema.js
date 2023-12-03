import { get } from '../../lib/utils'
import { useVocabulary } from './useVocabulary'

export function useVocabularyDynamicBySchema(schema) {
  const isMultiple = schema?.type === 'array'
  const vocabularyName = isMultiple
    ? get(schema, 'items.vocabularyName', null)
    : get(schema, 'vocabularyName', null)

  return useVocabulary(vocabularyName, null)
}
