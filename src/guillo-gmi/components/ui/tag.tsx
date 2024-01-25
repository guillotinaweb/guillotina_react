import { classnames } from '../../lib/helpers'

interface Props {
  name: string
  id: string
  onRemove?: () => void
  size?: string
  color?: string
}
export const Tag = ({
  name,
  id,
  onRemove,
  size = 'is-medium',
  color = 'is-warning',
}: Props) => (
  <span className={classnames(['tag', color, size])} data-test={`tag-${id}`}>
    {name}
    {onRemove !== undefined && (
      <button className="delete is-small" onClick={() => onRemove()}></button>
    )}
  </span>
)
