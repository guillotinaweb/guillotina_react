import { classnames } from '../../lib/helpers'

interface Props {
  icon: string
  className?: string
  align?: string
}

export const Icon = ({ icon, className, align }: Props) => {
  const addClass = className ? className.split(' ') : [className]

  align = align || 'is-right'

  return (
    <span className={classnames(['icon', align, ...addClass])}>
      <i className={icon}></i>
    </span>
  )
}
