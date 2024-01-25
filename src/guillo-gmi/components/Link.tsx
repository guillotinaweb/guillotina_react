import { useLocation } from '../hooks/useLocation'
import { ItemModel } from '../models'

interface Props {
  aRef?: React.Ref<HTMLAnchorElement>
  model: ItemModel
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export function Link({ aRef, model, children, ...props }: Props) {
  const [path, navigate] = useLocation()
  const aStyle = { textDecoration: 'none', color: 'currentColor' }

  function onClick(e) {
    e.stopPropagation()
    if (actAsLink(e)) return
    e.preventDefault()
    navigate({ path: model.path }, true)
    if (props.onClick) props.onClick(e)
  }

  return (
    <a
      ref={aRef}
      href={`?${path}${model.id}/`}
      style={aStyle}
      onClick={onClick}
    >
      {children}
    </a>
  )
}

function actAsLink(e) {
  return e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0
}
