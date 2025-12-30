import React from 'react';

export const Checkbox = React.forwardRef(({
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <input
      ref={ref}
      type="checkbox"
      disabled={disabled}
      className={`
        w-4 h-4 border border-gray-300 rounded
        cursor-pointer accent-blue-600
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    />
  );
});

Checkbox.displayName = 'Checkbox';
