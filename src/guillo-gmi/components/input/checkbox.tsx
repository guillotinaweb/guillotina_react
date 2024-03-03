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
}: Props) => {
  const inputRef = useRef(null)
  const [state, setState] = useState<boolean>(checked)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  const updateState = (ev: ChangeEvent<HTMLInputElement>) => {
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
          className={classnames(['checkbox', classNameInput])}
          checked={state}
          onChange={updateState}
          data-test={dataTest}
        />
        {children || placeholder}
      </label>
    </div>
  )
}
