import { useCallback, useState } from 'react'

export default function useSetState<T>(
  initialState
): [T, (value: Partial<T>) => void] {
  const [state, set] = useState<T>(initialState)
  const setState = useCallback(
    (patch) => {
      set((prevState) =>
        Object.assign(
          {},
          prevState,
          patch instanceof Function ? patch(prevState) : patch
        )
      )
    },
    [set]
  )

  return [state, setState]
}
