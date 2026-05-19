import { classnames } from '../lib/helpers'

interface Props {
  children: React.ReactNode
  id?: string
  className?: string
}

export default function ErrorZone({
  children,
  id,
  className = '',
}: Props) {
  return (
    <p className={classnames(['help is-danger', className])} id={id}>
      {children}
    </p>
  )
}
