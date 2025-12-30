import React, { useState } from 'react';

export const Switch = React.forwardRef(({
  checked = false,
  disabled = false,
  onCheckedChange,
  className = '',
  ...props
}, ref) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = (e) => {
    const newValue = e.target.checked;
    setIsChecked(newValue);
    if (onCheckedChange) {
      onCheckedChange(newValue);
    }
  };

  return (
    <label
      className={`
        inline-flex items-center cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <input
        ref={ref}
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <div
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${isChecked ? 'bg-blue-600' : 'bg-gray-300'}
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${isChecked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </div>
    </label>
  );
});

Switch.displayName = 'Switch';

export default Switch;
