import React from 'react';
import PropTypes from 'prop-types';
import { noop } from '../../lib/helpers';
import { classnames } from '../../lib/helpers';


export const Form = ({
  children,
  className = '',
  onSubmit = noop,
  onReset = noop,
  autoComplete = 'off',
  ...rest }
) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(event);
    };
    return (
        <form
            onSubmit={handleSubmit}
            onReset={onReset}
            autoComplete={autoComplete}
            className={classnames(['form', className])}
            {...rest}
        >
            {children}
        </form>
    );
};

Form.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onSubmit: PropTypes.func,
    onReset: PropTypes.func,
    autoComplete: PropTypes.string
};

