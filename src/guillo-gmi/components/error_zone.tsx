import PropTypes from 'prop-types'
import { classnames } from '../lib/helpers'

interface Props {
  children: React.ReactNode
  id?: string
  className?: string
}

const ErrorZone = ({ children, id, className = '' }: Props) => {
  return (
    <p className={classnames(['help is-danger', className])} id={id}>
      {children}
    </p>
  )
}

ErrorZone.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  className: PropTypes.string,
}

export default ErrorZone
