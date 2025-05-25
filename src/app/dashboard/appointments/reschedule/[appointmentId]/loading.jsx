// src/components/AppointmentFormSkeleton.jsx
import React from 'react';

const AppointmentFormSkeleton = () => {
  const fieldClasses = "h-10 bg-gray-200 rounded mb-4";
  const halfField = "h-10 bg-gray-200 rounded mb-4 w-1/2";

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md animate-pulse">
      {/* Title */}
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />

      {/* Doctor dropdown */}
      <div className={fieldClasses} />

      {/* Date + Time row */}
      <div className="flex space-x-4">
        <div className={halfField} />
        <div className={halfField} />
      </div>

      {/* Location */}
      <div className={fieldClasses} />

      {/* Status */}
      <div className={fieldClasses} />

      {/* Details textarea */}
      <div className="h-24 bg-gray-200 rounded mb-6" />

      {/* Submit button */}
      <div className="h-10 bg-gray-200 rounded w-1/3" />
    </div>
  );
};

export default AppointmentFormSkeleton;
