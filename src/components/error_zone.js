import React from 'react';
import PropTypes from 'prop-types';
import { classnames } from '../lib/helpers';

const ErrorZone = ({ children, id, className }) => {
    return (
        <p className={classnames(['help is-danger', className])} id={id}>
            {children}
        </p>
    );
};

ErrorZone.propTypes = {
    children: PropTypes.node,
    id: PropTypes.string,
    className: PropTypes.string
};

export default ErrorZone;
