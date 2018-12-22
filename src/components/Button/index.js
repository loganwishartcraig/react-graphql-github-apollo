import React from 'react';

const Button = ({
    children,
    className,
    color = 'black',
    type = 'button',
    ...props
}) => (
        <button
            type={type}
            className={`${className} Button Button_${color}`}
            {...props}
        >
            {children}
        </button>
    );

export default Button;
