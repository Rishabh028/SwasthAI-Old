import React, { createContext, useState, useContext } from 'react';
import { ChevronDown } from 'lucide-react';

const SelectContext = createContext();

export const Select = ({ children, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const handleValueChange = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    onValueChange?.(value);
  };

  return (
    <SelectContext.Provider value={{ isOpen, setIsOpen, selectedValue, handleValueChange }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children, className = '' }) => {
  const { isOpen, setIsOpen } = useContext(SelectContext);
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {children}
      <ChevronDown size={16} className="text-gray-600" />
    </button>
  );
};

export const SelectValue = ({ placeholder = '' }) => {
  const { selectedValue } = useContext(SelectContext);
  return <span>{selectedValue || placeholder}</span>;
};

export const SelectContent = ({ children, className = '' }) => {
  const { isOpen } = useContext(SelectContext);
  
  if (!isOpen) return null;
  
  return (
    <div className={`absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto ${className}`}>
      {children}
    </div>
  );
};

export const SelectItem = ({ value, children, className = '' }) => {
  const { handleValueChange } = useContext(SelectContext);
  
  return (
    <button
      onClick={() => handleValueChange(value)}
      className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${className}`}
    >
      {children}
    </button>
  );
};
