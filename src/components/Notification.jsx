import React from 'react';
import { Alert, IconCheck, IconAlertTriangle, IconInfoCircle, IconCircleX } from '@/ui';

const CONFIG = {
  success: { Icon: IconCheck },
  error: { Icon: IconCircleX },
  warning: { Icon: IconAlertTriangle },
  info: { Icon: IconInfoCircle },
};

export default function Notification({ message, type = 'info', onClose }) {
  const { Icon } = CONFIG[type] ?? CONFIG.info;
  return (
    <Alert type={type} icon={Icon} onClose={onClose}>
      {message}
    </Alert>
  );
}
