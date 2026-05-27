import React from 'react';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRouter from './infra/router';

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppRouter />
      </NotificationProvider>
    </ThemeProvider>
  );
}
