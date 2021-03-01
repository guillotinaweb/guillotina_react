import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ErrorZone from '../error_zone'
import { classnames, generateUID } from '../../lib/helpers'

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
      ...rest
    },
    ref
  ) => {
    const [uid] = useState(generateUID('select'))

    const onUpdate = (ev) => {
      if (ev.target.value === '') {
        onChange({ target: { value: undefined } })
      } else {
        onChange(ev)
      }
    }

    if (appendDefault) {
      options = [{ text: 'Choose..', value: '' }].concat(options)
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
            size={size}
            multiple={multiple}
            disabled={loading || rest.disabled}
            onChange={onUpdate}
            {...rest}
            ref={ref}
            style={style}
            data-test={dataTest}
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
