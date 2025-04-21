// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'coffee-dark' }) => {
  // Define sizes
  const sizes = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };
  
  // Get the appropriate size
  const sizeClass = sizes[size] || sizes.medium;
  
  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClass} animate-spin rounded-full border-b-2 border-${color}`}></div>
    </div>
  );
};

export default LoadingSpinner;