import React from 'react';

export const Textarea = React.forwardRef(({
  placeholder = '',
  disabled = false,
  className = '',
  rows = 4,
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className={`
        w-full px-4 py-2 border border-gray-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        disabled:bg-gray-100 disabled:cursor-not-allowed
        transition-colors duration-200 resize-none
        ${className}
      `}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
