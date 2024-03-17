import ErrorZone from '../error_zone'
import { classnames, generateUID } from '../../lib/helpers'
import { useIntl } from 'react-intl'
import { genericMessages } from '../../locales/generic_messages'
import { forwardRef, useState } from 'react'
import { IndexSignature } from '../../types/global'
// @ TODO implement hasErrors

interface Props {
  error?: string
  errorZoneClassName?: string
  size?: number
  placeholder?: string
  id?: string
  className?: string
  classWrap?: string
  disabled?: boolean
  multiple?: boolean
  loading?: boolean
  onChange?: (value: string | string[]) => void
  options: { text: string; value: string }[]
  appendDefault?: boolean
  style?: IndexSignature
  dataTest?: string
  value?: string | string[]
}

export const Select = forwardRef<HTMLSelectElement, Props>(
  (
    {
      options,
      error,
      errorZoneClassName,
      size = 1,
      placeholder,
      id,
      className = '',
      classWrap = '',
      multiple = false,
      loading = false,
      onChange,
      appendDefault = false,
      style = {},
      dataTest,
      value,
      disabled,
    },
    ref
  ) => {
    const intl = useIntl()
    const [uid] = useState(generateUID('select'))

    const onUpdate = (ev: React.ChangeEvent<HTMLSelectElement>) => {
      if (multiple) {
        let selectValue: string[] = []
        for (let i = 0; i < ev.target.selectedOptions.length; i++) {
          selectValue = selectValue.concat([ev.target.selectedOptions[i].value])
        }
        if (onChange) {
          onChange(selectValue)
        }
      } else {
        if (onChange) {
          onChange(ev.target.value)
        }
      }
    }

    if (appendDefault) {
      options = [
        { text: intl.formatMessage(genericMessages.choose), value: '' },
      ].concat(options)
    }
    const statusClasses = error ? 'is-danger' : ''

    const cssWrap = [
      'select',
      statusClasses,
      multiple ? 'is-multiple' : '',
      classWrap,
    ]

    return (
      <div className="field">
        {id && placeholder ? (
          <label className="label" htmlFor={id}>
            {placeholder}
          </label>
        ) : null}
        <div className={classnames(cssWrap)}>
          <select
            className={classnames(['', className])}
            size={multiple ? 5 : size}
            multiple={multiple}
            disabled={loading || disabled}
            onChange={onUpdate}
            ref={ref}
            style={style}
            data-test={dataTest}
            value={value}
          >
            {options.map(({ text, ...rest }, index) => (
              <option key={index.toString()} {...rest}>
                {text}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <ErrorZone className={errorZoneClassName} id={uid}>
            {error ? error : ''}
          </ErrorZone>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
export default Select
