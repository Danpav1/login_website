import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-sky-500"></div>
  </div>
);

export default LoadingSpinner;
