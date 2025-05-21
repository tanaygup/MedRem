// src/components/AppointmentListSkeleton.jsx
"use client";
import React from 'react';

const AppointmentListSkeleton = ({ count = 2 }) => {
  const cards = Array.from({ length: count });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      {/* Header skeleton */}
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />

      {/* Cards skeleton */}
      {cards.map((_, i) => (
        <div
          key={i}
          className="flex items-start justify-between p-4 bg-gray-100 rounded-lg animate-pulse"
        >
          {/* Left section: avatar + text */}
          <div className="flex items-start space-x-4">
            {/* avatar */}
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            {/* text lines */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-3 bg-gray-200 rounded w-24 mt-2" />
            </div>
          </div>

          {/* Right section: date icon */}
          <div className="w-6 h-6 bg-gray-200 rounded" />

          {/* Bottom row: location + buttons */}
          <div className="flex-1 flex justify-between items-center mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded-full" />
              <div className="h-3 bg-gray-200 rounded w-16" />
            </div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-200 rounded w-20" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          </div>
        </div>
      ))}

      {/* Footer “Schedule New” button */}
      <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto animate-pulse" />
    </div>
  );
};

export default AppointmentListSkeleton;
