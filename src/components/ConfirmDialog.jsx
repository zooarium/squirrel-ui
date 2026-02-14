import React from 'react';

const ConfirmDialog = ({ message, onConfirm, onCancel, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div
      className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black font-mono text-green-400"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-sm rounded-lg border border-green-600 bg-black/80 p-6 shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-green-400 transition-colors hover:text-white"
          aria-label="Close dialog"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-shadow-glow mb-4 text-lg font-semibold">{message}</h2>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-700 px-4 py-2 text-white hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
