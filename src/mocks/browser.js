// MSW browser worker — optional dev-mode mock API.
// Start in main.jsx for fully offline dev (no backend needed):
//
//   if (import.meta.env.DEV && import.meta.env.VITE_MOCK_API === 'true') {
//     const { worker } = await import('./mocks/browser');
//     await worker.start({ onUnhandledRequest: 'warn' });
//   }
//
// Then set VITE_MOCK_API=true in .env.development.
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
