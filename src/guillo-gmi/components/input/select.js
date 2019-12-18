import React from 'react';
import PropTypes from 'prop-types';

import { classnames } from '../../lib/helpers';

// @ TODO implement hasErrors

/** @type any */
export const Select = ({
    options,
    error,
    size = 1,
    className = '',
    multiple = false,
    loading = false,
    isSubmitted,
    onChange,
    resetOnChange,
    appendDefault = false,
    ...rest
}) => {

    const ref = React.useRef()

    const onUpdate = (ev) => {
      if (ev.target.value === "") {
        onChange(undefined)
      } else {
        onChange(ev)
      }
      if (resetOnChange) {
        ref.current.value = ''
      }
    }

    if (appendDefault) {
      options = [{ text: "Choose..", value: "" }].concat(options)
    }

    return (
        <div className={classnames(["select", (multiple ? 'is-multiple' :'')])}>
          <select
              className={classnames(['', className])}
              size={size}
              multiple={multiple}
              disabled={loading || rest.disabled}
              onChange={onUpdate}
              {...rest}
              ref={ref}
          >
              {options.map(({ text, ...rest }, index) => (
                <option key={index.toString()} {...rest}>
                  {text}
                </option>
              ))}
          </select>
        </div>
    );
};

Select.propTypes = {
    error: PropTypes.string,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    isSubmitted: PropTypes.bool,
    size: PropTypes.number,
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.object),
    multiple: PropTypes.bool,
    className: PropTypes.string
};

