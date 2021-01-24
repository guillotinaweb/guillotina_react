import React from 'react'
import { classnames } from '../../lib/helpers'

const noop = () => {}

export const Button = ({
  children,
  className = 'is-primary',
  onClick,
  type = 'submit',
  loading = false,
  disabled = false,
  dataTest,
  ...rest
}) => {
  let css = [].concat('button', ...className.split(' '))
  if (loading) css = css.concat('is-loading')
  if (disabled) onClick = noop

  return (
    <p className="control">
      <button
        type={type}
        className={classnames(css)}
        onClick={onClick}
        disabled={disabled}
        {...rest}
        data-test={dataTest}
      >
        {children}
      </button>
    </p>
  )
}
