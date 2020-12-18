import React, { useState, useRef } from 'react'
import useClickAway from '../../hooks/useClickAway'

export default function Dropdown({
  children,
  disabled,
  id,
  isRight,
  onChange,
  optionDisabledWhen,
  options,
  ...props
}) {
  const ref = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const position = isRight ? 'is-right' : ''
  const status = isActive
    ? `dropdown ${position} is-active`
    : `dropdown ${position}`

  useClickAway(ref, () => {
    setIsActive(false)
  })

  return (
    <div ref={ref} className={status} {...props}>
      <div className="dropdown-trigger">
        <button
          className="button is-size-7"
          onClick={() => setIsActive(!isActive)}
          aria-haspopup="true"
          disabled={disabled}
          aria-controls={id}
        >
          {children}
        </button>
      </div>
      <div className="dropdown-menu" id={id} role="menu">
        <div className="dropdown-content">
          {options.map((option) => {
            const disabled =
              typeof optionDisabledWhen === 'function'
                ? optionDisabledWhen(option)
                : false

            return (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a
                className={
                  disabled ? 'dropdown-item is-active' : 'dropdown-item'
                }
                key={option.text}
                onClick={disabled ? undefined : () => onChange(option.value)}
                style={
                  disabled
                    ? {
                        cursor: 'not-allowed',
                        color: 'black',
                        opacity: 0.5,
                        backgroundColor: '#eeeeee',
                      }
                    : {}
                }
              >
                {option.text}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
