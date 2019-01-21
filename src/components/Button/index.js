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

const ButtonUnobtrusive = ({
    children,
    className,
    type = 'button',
    ...props
}) => (
        <button
            className={`${className} Button_unobtrusive`}
            type={type}
            {...props}
        >
            {children}
        </button>
    );

export { ButtonUnobtrusive };

export default Button;
