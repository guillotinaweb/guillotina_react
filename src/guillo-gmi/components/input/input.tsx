import { forwardRef, useRef, useState } from 'react'
import { classnames, generateUID } from '../../lib/helpers'
import ErrorZone from '../error_zone'
import useInput from '../../hooks/useInput'
import { notEmpty } from '../../lib/validators'
import { useEffect } from 'react'

const noop = () => true
interface Props {
  name?: string
  icon?: JSX.Element
  iconPosition?: 'has-icons-left' | 'has-icons-right'
  error?: string
  errorZoneClassName?: string
  autoComplete?: string
  className?: string
  widget?: string
  loading?: boolean
  validator?: ((value: string) => boolean) | ((value: string) => boolean)[]
  errorMessage?: string
  dataTest?: string
  autofocus?: boolean
  onChange?: (value: string) => void
  type?: string
  value?: string
  required?: boolean
  id?: string
  placeholder?: string
  disabled?: boolean
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

export const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      icon,
      iconPosition = 'has-icons-right',
      error,
      errorZoneClassName,
      autoComplete = 'off',
      className = '',
      widget = 'input',
      type = 'text',
      loading = false,
      required = false,
      id,
      placeholder,
      value,
      autofocus = false,
      onChange,
      validator = noop,
      errorMessage,
      dataTest = 'testInput',
      disabled,
      onKeyUp,
    },
    ref
  ) => {
    let validatorFn = null
    if (required) {
      validatorFn = Array.isArray(validator)
        ? validator.push(notEmpty)
        : [validator, notEmpty]
    }

    const { state, ...handlers } = useInput(onChange, value ?? '', validatorFn)
    const [uid] = useState(generateUID('input'))
    const [mounted, setMounted] = useState(false)
    // eslint-disable-next-line
    ref = ref || useRef()

    useEffect(() => {
      setMounted(true)
    }, [])

    useEffect(() => {
      if (autofocus && !error && ref != null && typeof ref !== 'function') {
        ref.current.focus()
      }
    }, [mounted, autofocus, ref, error])

    const theError = state.hasError ? errorMessage || 'invalid field' : ''
    const statusClasses = state.hasError ? 'is-danger' : ''

    const cssControl = () => (icon ? ['control', iconPosition] : ['control'])

    return (
      <div className="field">
        {id && placeholder ? (
          <label className="label" htmlFor={id}>
            {placeholder}
          </label>
        ) : null}
        <div className={classnames(cssControl())}>
          <input
            className={classnames([widget, className, statusClasses])}
            aria-describedby={uid}
            id={id}
            ref={ref}
            type={type}
            value={state.value}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={loading || disabled}
            required={required}
            data-test={dataTest}
            onKeyUp={onKeyUp}
            {...handlers}
          />
          {icon && icon}
        </div>
        <ErrorZone className={errorZoneClassName} id={uid}>
          {state.hasError ? theError : ''}
        </ErrorZone>
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
