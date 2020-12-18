import React from 'react'
import PropTypes from 'prop-types'
import { noop } from '../../lib/helpers'
import { classnames } from '../../lib/helpers'

export const Form = ({
  children,
  className = '',
  onSubmit = noop,
  onReset = noop,
  autoComplete = 'off',
  title,
  error,
  ...rest
}) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(event)
  }
  return (
    <React.Fragment>
      {title && (
        <div className="level">
          <h1 className="title is-size-4">{title}</h1>
        </div>
      )}
      {error && <div className="notification is-danger">{error}</div>}
      <form
        onSubmit={handleSubmit}
        onReset={onReset}
        autoComplete={autoComplete}
        className={classnames(['form', className])}
        {...rest}
      >
        {children}
      </form>
    </React.Fragment>
  )
}

Form.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onSubmit: PropTypes.func,
  onReset: PropTypes.func,
  autoComplete: PropTypes.string,
}
