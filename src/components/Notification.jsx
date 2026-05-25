import React from 'react';
import { IconCheck, IconAlertTriangle, IconInfoCircle, IconCircleX } from '@tabler/icons-react';

const CONFIG = {
  success: { color: 'success', Icon: IconCheck },
  error: { color: 'danger', Icon: IconCircleX },
  warning: { color: 'warning', Icon: IconAlertTriangle },
  info: { color: 'info', Icon: IconInfoCircle },
};

export default function Notification({ message, type = 'info', onClose }) {
  const { color, Icon } = CONFIG[type] ?? CONFIG.info;

  return (
    <div
      className={`alert alert-${color} alert-dismissible d-flex align-items-center shadow-sm`}
      role="alert"
    >
      <Icon size={18} className="me-2 flex-shrink-0" />
      <div className="flex-grow-1">{message}</div>
      <button type="button" className="btn-close ms-2" onClick={onClose} aria-label="Close" />
    </div>
  );
}
