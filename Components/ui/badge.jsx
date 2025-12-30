import React from 'react';

const variants = {
  primary: 'bg-blue-100 text-blue-800',
  secondary: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
};

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variantClass = variants[variant] || variants.primary;
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${variantClass} ${className}`}>
      {children}
    </span>
  );
};
