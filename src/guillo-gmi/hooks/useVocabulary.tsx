import { useTraversal } from '../contexts'
import { GuillotinaVocabulary } from '../types/guillotina'
import useSetState from './useSetState'
import { useEffect } from 'react'

interface State {
  data: GuillotinaVocabulary
  loading: boolean
  error: any
}
export function useVocabulary(vocabularyName: string, path: string = null) {
  const traversal = useTraversal()

  const [vocabulary, setVocabulary] = useSetState<State>({
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
          setVocabulary({ loading: false, error: err, data: undefined })
        }
      }
    })()
  }, [vocabularyName, vocabulary, path])

  return vocabulary
}
