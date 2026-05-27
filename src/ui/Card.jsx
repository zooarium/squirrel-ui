import React from 'react';

export function Card({ children, className = '', ...props }) {
  return (
    <div className={`card ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`card-header ${className}`.trim()}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`card-title ${className}`.trim()}>{children}</h3>;
}

export function CardBody({ children, className = '', noPadding = false }) {
  const base = noPadding ? 'card-body p-0' : 'card-body';
  return <div className={`${base} ${className}`.trim()}>{children}</div>;
}
