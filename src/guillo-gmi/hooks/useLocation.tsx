import { useEffect, useRef, useState, useCallback } from 'react'
import { IndexSignature } from '../types/global'

// Mostly inspired from
// https://github.com/molefrog/wouter

const setURLParams = (p) => {
  return window.history.pushState(
    0,
    '0',
    '' + '?' + p.toString().replace(/%2F/g, '/')
  )
}

const clean = (to) => {
  const current = new URLSearchParams()
  Object.keys(to).forEach((_key) => current.set(_key, to[_key]))
  setURLParams(current)
}

export const useLocation = (): [
  URLSearchParams,
  (to: IndexSignature, replace?: boolean) => void,
  (param: string) => void
] => {
  const [path, update] = useState(currentSearchParams())
  const prevPath = useRef(path)

  useEffect(() => {
    patchHistoryEvents()

    // this function checks if the location has been changed since the
    // last render and updates the state only when needed.
    // unfortunately, we can't rely on `path` value here, since it can be stale,
    // that's why we store the last pathname in a ref.
    const checkForUpdates = () => {
      const pathname = currentSearchParams()
      prevPath.current !== pathname && update((prevPath.current = pathname))
    }

    const events = ['popstate', 'pushState', 'replaceState']
    events.map((e) => window.addEventListener(e, checkForUpdates))

    // it's possible that an update has occurred between render and the effect handler,
    // so we run additional check on mount to catch these updates. Based on:
    // https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189
    checkForUpdates()

    return () => {
      events.map((e) => window.removeEventListener(e, checkForUpdates))
    }
  }, [])

  // the 2nd argument of the `useLocation` return value is a function
  // that allows to perform a navigation.
  //
  // the function reference should stay the same between re-renders, so that
  // it can be passed down as an element prop without any performance concerns.
  const navigate = useCallback(
    (to, replace) => {
      if (replace) {
        clean(to)
        return
      }
      const current = new URLSearchParams(path.toString())
      Object.keys(to).forEach((_key) => current.set(_key, to[_key]))
      setURLParams(current)
    },
    [path]
  )

  const remove = useCallback(
    (param) => {
      const current = new URLSearchParams(path.toString())
      current.delete(param)
      setURLParams(current)
    },
    [path]
  )

  return [path, navigate, remove]
}

// While History API does have `popstate` event, the only
// proper way to listen to changes via `push/replaceState`
// is to monkey-patch these methods.
//
// See https://stackoverflow.com/a/4585031

let patched = 0

const patchHistoryEvents = () => {
  if (patched) return
  ;['pushState', 'replaceState'].map((type) => {
    const original = window.history[type]

    window.history[type] = function (...args) {
      const result = original.apply(this, args)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const event: any = new Event(type)
      event.arguments = args

      dispatchEvent(event)
      return result
    }
  })

  return (patched = 1)
}

const currentSearchParams = (path = window.location.search) =>
  new URLSearchParams(path)
