'use client'

import { useState, useEffect } from 'react';

const RangeSlider = ({ 
  value, 
  onChange, 
  min = 12, 
  max = 36, 
  step = 1,
  label = "Value",
  unit = "",
  leftIcon = null,
  rightIcon = null,
  showMinMax = true,
  className = ""
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={`w-full mb-4 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}: {localValue}{unit}</label>
        {showMinMax && <span className="text-xs text-gray-500">{min}{unit} - {max}{unit}</span>}
      </div>
      <div className="flex items-center gap-3">
        {leftIcon ? (
          leftIcon
        ) : (
          <span className="text-xs font-medium text-gray-500">A</span>
        )}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        {rightIcon ? (
          rightIcon
        ) : (
          <span className="text-base font-medium text-gray-500">A</span>
        )}
      </div>
    </div>
  );
};

export default RangeSlider; 