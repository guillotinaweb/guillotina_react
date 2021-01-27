import React, { useEffect, useRef } from 'react'
import { classnames } from '../../lib/helpers'

export const Checkbox = ({
  id,
  className,
  loading,
  disabled,
  indeterminate = false,
  value = false,
  color,
  backgroundColor,
  borderColor,
  children,
  placeholder,
  onChange,
  dataTest,
  ...rest
}) => {
  const inputRef = useRef(null)
  const [state, setState] = React.useState(value)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  const updateState = (ev) => {
    setState(ev.target.checked)
    onChange(ev.target.checked)
  }

  return (
    <div className="field">
      <label htmlFor={id} className={classnames(['checkbox', className])}>
        <input
          ref={inputRef}
          disabled={disabled || loading}
          id={id}
          type="checkbox"
          className="checkbox"
          checked={state}
          onChange={updateState}
          data-test={dataTest}
          {...rest}
        />
        {children || placeholder}
      </label>
    </div>
  )
}
