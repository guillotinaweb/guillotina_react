import React, { useState, useRef } from 'react'
import { useClickAway } from 'react-use';

export default function Dropdown({ 
  children, 
  disabled,
  id, 
  onChange,
  isRight,
  options, 
  ...props 
}) {
  const ref = useRef(null);
  const [isActive, setIsActive] = useState(false)
  const position = isRight ? 'is-right' : ''
  const status = isActive
    ? `dropdown ${position} is-active`
    : `dropdown ${position}`

  useClickAway(ref, () => { setIsActive(false) })

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
          {
            options.map(option => (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a 
               className="dropdown-item"
               key={option.text} 
               onClick={() => onChange(option.value)}
               >
                {option.text}
              </a>
            ))}
        </div>
      </div>
    </div>
  )
}
