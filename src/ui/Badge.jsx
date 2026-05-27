import React from 'react';

const COLOR_MAP = {
  success: 'bg-success-lt',
  danger: 'bg-danger-lt',
  warning: 'bg-warning-lt',
  info: 'bg-info-lt',
  secondary: 'bg-secondary-lt',
  primary: 'bg-primary-lt',
};

export default function Badge({ children, color = 'secondary', className = '' }) {
  return (
    <span className={`badge ${COLOR_MAP[color] ?? color} ${className}`.trim()}>
      {children}
    </span>
  );
}
