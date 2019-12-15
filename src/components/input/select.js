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
    ...rest
}) => {

    const ref = React.useRef()

    const onUpdate = (ev) => {
      onChange(ev)
      if (resetOnChange) {
        ref.current.value = ''
      }
    }

    return (
        <div className="select">
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

