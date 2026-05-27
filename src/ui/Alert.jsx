import React from 'react';

const COLOR_MAP = {
  success: 'success',
  error: 'danger',
  warning: 'warning',
  info: 'info',
};

export default function Alert({ children, icon: Icon, type = 'info', onClose, className = '' }) {
  const color = COLOR_MAP[type] ?? type;
  return (
    <div
      className={`alert alert-${color}${onClose ? ' alert-dismissible' : ''} d-flex align-items-center shadow-sm ${className}`.trim()}
      role="alert"
    >
      {Icon && <Icon size={18} className="me-2 flex-shrink-0" />}
      <div className="flex-grow-1">{children}</div>
      {onClose && (
        <button type="button" className="btn-close ms-2" onClick={onClose} aria-label="Close" />
      )}
    </div>
  );
}
