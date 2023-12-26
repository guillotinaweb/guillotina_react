import { useTraversal } from '../contexts'
import useSetState from './useSetState'
import { useEffect } from 'react'

export function useVocabulary(vocabularyName, path) {
  const traversal = useTraversal()

  const [vocabulary, setVocabulary] = useSetState({
    data: undefined,
    loading: false,
    error: undefined,
  })

  const getPath = () => {
    if (path) return path
    return `${traversal.path}@vocabularies/${vocabularyName}`
  }

  useEffect(() => {
    ;(async () => {
      if (
        vocabularyName &&
        vocabulary.data === undefined &&
        !vocabulary.loading
      ) {
        try {
          setVocabulary({ loading: true })
          const data = await traversal.client.get(getPath())
          const dataJson = await data.json()
          setVocabulary({ loading: false, data: dataJson })
        } catch (err) {
          setVocabulary({ loading: false, error: err, data: {} })
        }
      }
    })()
  }, [vocabularyName, vocabulary, path])

  return vocabulary
}
