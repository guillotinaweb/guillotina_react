import ErrorZone from '../error_zone'
import { classnames, generateUID } from '../../lib/helpers'
import { ChangeEvent, forwardRef, useState } from 'react'

interface Props {
  value: string
  classWrap?: string
  rows?: number
  className?: string
  onChange?: (value: string) => void
  dataTest?: string
  error?: string
  errorZoneClassName?: string
  placeholder?: string
  id?: string
}
export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      value = '',
      classWrap = '',
      rows = 5,
      className = '',
      onChange,
      dataTest,
      error,
      errorZoneClassName,
      placeholder,
      id,
    },
    ref
  ) => {
    const [uid] = useState(generateUID('select'))

    const onUpdate = (ev: ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(ev.target.value)
      }
    }
    const statusClasses = error ? 'is-danger' : ''

    return (
      <div className="field">
        {id && placeholder ? (
          <label className="label" htmlFor={id}>
            {placeholder}
          </label>
        ) : null}
        <div className={classWrap}>
          <textarea
            className={classnames(['textarea', className, statusClasses])}
            rows={rows}
            onChange={onUpdate}
            value={value}
            data-test={dataTest}
            ref={ref}
          />
        </div>
        <ErrorZone className={errorZoneClassName} id={uid}>
          {error ? error : ''}
        </ErrorZone>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export default Textarea
