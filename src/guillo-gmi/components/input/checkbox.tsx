import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { classnames } from '../../lib/helpers'

interface Props {
  className?: string
  classNameInput?: string
  loading?: boolean
  indeterminate?: boolean
  backgroundColor?: string
  borderColor?: string
  dataTest?: string
  onChange: (value: boolean) => void
  id?: string
  disabled?: boolean
  checked?: boolean
  children?: React.ReactNode
  placeholder?: string
  variant?: 'checkbox' | 'switch'
}

export const Checkbox = ({
  id,
  className,
  classNameInput,
  loading,
  disabled,
  indeterminate = false,
  checked,
  children,
  placeholder,
  onChange,
  dataTest,
  variant = 'checkbox',
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<boolean>(!!checked)

  useEffect(() => {
    setState((current) => (current !== !!checked ? !!checked : current))
  }, [checked])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  const updateState = (ev: ChangeEvent<HTMLInputElement>) => {
    setState(ev.target.checked)
    onChange(ev.target.checked)
  }

  if (variant === 'switch') {
    return (
      <div className="field">
        <label
          htmlFor={id}
          className={classnames([
            'checkbox switch-control',
            state ? 'is-checked' : '',
            disabled || loading ? 'is-disabled' : '',
            className ?? '',
          ])}
        >
          <input
            ref={inputRef}
            disabled={disabled || loading}
            id={id}
            type="checkbox"
            className={classnames(['switch-input', classNameInput ?? ''])}
            checked={state}
            onChange={updateState}
            data-test={dataTest}
          />
          <span className="switch-track" aria-hidden="true">
            <span className="switch-thumb"></span>
          </span>
          {(children || placeholder) && (
            <span className="switch-label">{children || placeholder}</span>
          )}
        </label>
      </div>
    )
  }

  return (
    <div className="field">
      <label htmlFor={id} className={classnames(['checkbox', className ?? ''])}>
        <input
          ref={inputRef}
          disabled={disabled || loading}
          id={id}
          type="checkbox"
          className={classnames(['checkbox', classNameInput ?? ''])}
          checked={state}
          onChange={updateState}
          data-test={dataTest}
        />
        {children || placeholder}
      </label>
    </div>
  )
}
