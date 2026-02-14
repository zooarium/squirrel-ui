import React from 'react';

const Notification = ({ message, type, onClose }) => {
  const baseClasses =
    'p-4 rounded-lg shadow-lg text-white max-w-sm transform transition-transform duration-300';
  const typeClasses = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  };

  const bgColor = typeClasses[type] || typeClasses.info;

  if (!message) return null;

  return (
    <div className={`${baseClasses} ${bgColor} animate-slide-in`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 font-bold text-white">
          &times;
        </button>
      </div>
    </div>
  );
};

export default Notification;
