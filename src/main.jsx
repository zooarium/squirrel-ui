import '@tabler/core/dist/css/tabler.min.css';
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { configure } from '@aviary-ui/core';
import App from './App.jsx';

// Configure HTTP client once before any API calls.
// All VITE_* env vars must live in the consuming app — not in @aviary-ui/core.
configure({
  apiBase: import.meta.env.VITE_API_BE_URL,
  authBase: import.meta.env.VITE_API_URL,
  refreshPath: import.meta.env.VITE_REFRESH_PATH ?? '/users/refresh',
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
