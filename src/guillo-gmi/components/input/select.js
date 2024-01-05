import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ErrorZone from '../error_zone'
import { classnames, generateUID } from '../../lib/helpers'
import { get } from '../../lib/utils'
import { useIntl } from 'react-intl'
import { genericMessages } from '../../locales/generic_messages'
// @ TODO implement hasErrors

/** @type any */
export const Select = React.forwardRef(
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
      isSubmitted,
      onChange,
      appendDefault = false,
      style = {},
      dataTest,
      value,
      ...rest
    },
    ref
  ) => {
    const intl = useIntl()
    const [uid] = useState(generateUID('select'))

    const onUpdate = (ev) => {
      if (multiple) {
        let selectValue = []
        for (let i = 0; i < ev.target.selectedOptions.length; i++) {
          selectValue = selectValue.concat([ev.target.selectedOptions[i].value])
        }
        onChange(selectValue)
      } else {
        const selectValue = get(ev, 'target.value', undefined)
        onChange(selectValue)
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
            disabled={loading || rest.disabled}
            onChange={onUpdate}
            ref={ref}
            style={style}
            data-test={dataTest}
            value={value}
            {...rest}
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

Select.propTypes = {
  error: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  size: PropTypes.number,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.object),
  multiple: PropTypes.bool,
  className: PropTypes.string,
}
