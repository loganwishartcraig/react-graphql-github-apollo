import React from 'react';

const ErrorMessage = ({ error }) => (
    <div className="ErrorMessage">
        <span>{error.toString()}</span>
    </div>
);

export default ErrorMessage;
