import React from 'react';

export default function FormField({ label, htmlFor, error, children, className = '' }) {
  return (
    <div className={`mb-3 ${className}`.trim()}>
      {label && (
        <label className="form-label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

export function Input({ error, className = '', ...props }) {
  return (
    <input
      className={`form-control ${error ? 'is-invalid' : ''} ${className}`.trim()}
      {...props}
    />
  );
}

export function Select({ error, children, className = '', ...props }) {
  return (
    <select
      className={`form-select ${error ? 'is-invalid' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </select>
  );
}
