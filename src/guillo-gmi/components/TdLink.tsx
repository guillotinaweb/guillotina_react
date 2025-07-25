import { useRef } from 'react'
import { Link } from './Link'
import { ItemModel } from '../models'
import { IndexSignature } from '../types/global'
import { SearchOrCommonObject } from '../types/guillotina'

interface Props<T extends SearchOrCommonObject = SearchOrCommonObject> {
  model: ItemModel<T>
  children: React.ReactNode
  style?: IndexSignature
}
export function TdLink({ model, children, style = {} }: Props) {
  const link = useRef<HTMLAnchorElement>(null)

  function onClick() {
    if (link && link.current) {
      link.current.click()
    }
  }

  return (
    <td onClick={onClick} style={style}>
      <Link model={model} aRef={link}>
        {children}
      </Link>
    </td>
  )
}
