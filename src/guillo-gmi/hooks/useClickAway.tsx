import { useEffect, useRef } from 'react'

const defaultEvents = ['mousedown', 'touchstart']
const on = (
  obj: Document,
  type: keyof DocumentEventMap,
  handler: (ev: Event) => void
) => obj.addEventListener(type, handler)
const off = (
  obj: Document,
  type: keyof DocumentEventMap,
  handler: (ev: Event) => void
) => obj.removeEventListener(type, handler)

export default function useClickAway(
  ref: React.RefObject<HTMLElement>,
  onClickAway: (event: Event) => void,
  events = defaultEvents
) {
  const savedCallback = useRef(onClickAway)

  useEffect(() => {
    savedCallback.current = onClickAway
  }, [onClickAway])

  useEffect(() => {
    const handler = (event: Event) => {
      const { current: el } = ref
      el && !el.contains(event.target as Node) && savedCallback.current(event)
    }

    for (const eventName of events) {
      on(document, eventName as keyof DocumentEventMap, handler)
    }

    return () => {
      for (const eventName of events) {
        off(document, eventName as keyof DocumentEventMap, handler)
      }
    }
  }, [events, ref])
}
