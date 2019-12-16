import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {classnames, generateUID} from '../../lib/helpers';
import ErrorZone from '../error_zone';
import useInput from '../../hooks/useInput'
import { notEmpty } from "../../lib/validators";

const noop = () => true


/** @type any */
export const Input = React.forwardRef(
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
        onPressEnter,
        isSubmitted,
        loading = false,
        required = false,
        id,
        placeholder,
        value,
        autofocus = false,
        onChange,
        validator=noop,
        errorMessage,
        ...rest
      },
      ref
    ) => {

      if (required) {
        validator = Array.isArray(validator) ?
          validator.push(notEmpty) : [validator, notEmpty]
      }

      const {state, ...handlers} = useInput(onChange, value, validator)

      const [uid] = useState(generateUID('input'));
      ref = ref || React.useRef()
      const theError = state.hasError ? (errorMessage || 'invalid field') : ''
      const statusClasses = state.hasError ? 'is-danger' : ''

      const cssControl = () => (icon) ? (
        ['control', iconPosition]
      ) : (
        ['control']
      )

      React.useEffect(() => {
        if (autofocus) {
          ref.current.focus()
        }
      })

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
              aria-invalid={theError}
              aria-describedby={uid}
              id={id}
              ref={ref}
              type={type}
              value={state.value}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={loading || rest.disabled}
              required={required}
              {...handlers}
              {...rest}
            />
            {icon && icon}
          </div>
          <ErrorZone className={errorZoneClassName} id={uid}>
            {state.hasError ? theError : ''}
          </ErrorZone>
        </div>
      );
    }
);

Input.propTypes = {
  icon: PropTypes.node,
  iconPosition: PropTypes.arrayOf(PropTypes.oneOf(['has-icons-left', 'has-icons-right', ''])),
  error: PropTypes.string,
  errorZoneClassName: PropTypes.string,
  autoComplete: PropTypes.string,
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onPressEnter: PropTypes.func,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
};

