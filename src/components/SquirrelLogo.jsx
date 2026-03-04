import React from 'react';

const SquirrelLogo = ({ className = '', size = 40, onClick }) => {
  return (
    <div 
      className={`flex items-center ${className}`}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]"
      >
        <path d="M18 10a3 3 0 0 0-3-3h-1a4 4 0 0 0-4 4v2a4 4 0 0 1-4 4H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h1" />
        <path d="M18 10c0 4-3 7-7 7" />
        <path d="M12 10V9a4 4 0 0 1 4-4h1a3 3 0 0 1 3 3v1" />
        <circle cx="18" cy="10" r="1" fill="currentColor" />
      </svg>
    </div>
  );
};

export default SquirrelLogo;
