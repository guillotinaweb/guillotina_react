import { useState, useCallback } from 'react'

// **** Types **** //

export type TSetState<T> = (newPartialState: Partial<T>) => void

// **** Functions **** //

/**
 * Do setState like react class component.
 */
function useSetState<T extends object>(initialState: T): [T, TSetState<T>] {
  const [state, setState] = useState<T>(initialState)
  // Function which accepts a partial state to merge
  const setCustomState = useCallback((newPartialState: Partial<T>) => {
    try {
      setState(
        (prevState): T => {
          return { ...prevState, ...newPartialState }
        }
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }, [])
  // Return
  return [state, setCustomState]
}

// **** Export Default **** //

export default useSetState
