import React from 'react';

export default function Spinner({ color = 'primary', label = 'Loading…', centered = false }) {
  const spinner = (
    <div className={`spinner-border text-${color}`} role="status">
      <span className="visually-hidden">{label}</span>
    </div>
  );

  if (centered) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        {spinner}
      </div>
    );
  }

  return spinner;
}
