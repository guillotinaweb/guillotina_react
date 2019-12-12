import React from 'react'
import {classnames} from '../../lib/helpers'


export const Button = ({
  children,
  className = 'is-primary',
  onClick,
  type = 'submit',
  loading = false,
  ...rest
}) => {

  let css = [].concat(
      'button', ...className.split(" "),
  )
  if (loading) css = css.concat('is-loading')

  return (
    <p className="control">
      <button
        type={type}
        className={classnames(css)}
        onClick={onClick}
        {...rest}
        >
        {children}
      </button>
    </p>
  )
}
