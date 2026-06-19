import React from 'react';

const LoadingSkeleton = ({ rows = 5, type = 'table' }) => {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card p-5">
            <div className="skeleton h-4 w-3/4 mb-3"></div>
            <div className="skeleton h-8 w-1/2 mb-4"></div>
            <div className="skeleton h-3 w-full mb-2"></div>
            <div className="skeleton h-3 w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card p-5 flex items-center gap-4">
            <div className="skeleton w-12 h-12 rounded-xl"></div>
            <div className="flex-1">
              <div className="skeleton h-3 w-20 mb-2"></div>
              <div className="skeleton h-6 w-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <div className="skeleton h-4 w-48"></div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-white/5 flex gap-4">
          <div className="skeleton h-4 w-24"></div>
          <div className="skeleton h-4 w-32"></div>
          <div className="skeleton h-4 w-20"></div>
          <div className="skeleton h-4 w-16"></div>
          <div className="skeleton h-4 w-28"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
