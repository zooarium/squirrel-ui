import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { HomeProvider } from './context/HomeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HomeProvider>
      <App />
    </HomeProvider>
  </StrictMode>
);
