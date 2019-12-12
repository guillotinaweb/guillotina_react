/*
Based on
github.com/protonmail/react-components

*/

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {classnames, generateUID} from '../../lib/helpers';
import useInput from './useInput';
import ErrorZone from '../error_zone';


/** @type any */
export const Input = React.forwardRef(
    (
      {
        icon,
        iconPosition = '',
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
        ...rest
      },
      ref
    ) => {
      const {
        handlers,
        statusClasses,
        status
      } = useInput({ onPressEnter, isSubmitted, ...rest });

      const [uid] = useState(generateUID('input'));
      const errorZone = required && !value && !error ? "This field is required" : error;
      const hasError = errorZone && (status.isDirty || isSubmitted);

      ref = ref || React.useRef()

      const cssControl = () => (icon) ? (
        ['control'] + iconPosition
      ) : (
        ['control']
      )

      if (autofocus) {
        React.useEffect(() => {
          ref.current.focus()
        })
      }

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
              aria-invalid={hasError}
              aria-describedby={uid}
              id={id}
              ref={ref}
              type={type}
              value={value}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={loading || rest.disabled}
              required={required}
              {...rest}
              {...handlers}
            />
            {icon && icon}
          </div>
          <ErrorZone className={errorZoneClassName} id={uid}>
            {hasError ? errorZone : ''}
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
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onPressEnter: PropTypes.func,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
};

