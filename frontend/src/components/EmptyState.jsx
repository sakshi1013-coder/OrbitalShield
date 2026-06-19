import React from 'react';

const EmptyState = ({ icon: Icon, title, message, action }) => {
  return (
    <div className="glass-card p-12 text-center">
      {Icon && (
        <div className="mx-auto w-20 h-20 rounded-2xl bg-cyan-500/5 flex items-center justify-center mb-4">
          <Icon className="text-4xl text-gray-600" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-4">{message}</p>
      {action}
    </div>
  );
};

export default EmptyState;
