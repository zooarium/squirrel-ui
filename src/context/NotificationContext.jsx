import React, { createContext, useState, useCallback, useContext } from 'react';
import Notification from '@/components/Notification';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const hideNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback(
    (message, type = 'info') => {
      const id = Date.now();
      setNotifications((prev) => [...prev, { id, message, type }]);
      setTimeout(() => hideNotification(id), 5000);
    },
    [hideNotification]
  );

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 9999,
          width: '320px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {notifications.map((n) => (
          <Notification
            key={n.id}
            message={n.message}
            type={n.type}
            onClose={() => hideNotification(n.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
}
