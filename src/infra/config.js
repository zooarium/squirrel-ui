// Single source for all env vars and feature flags.
// No import.meta.env.* outside this file.
export const config = {
  apiBase: import.meta.env.VITE_API_BE_URL,
  authBase: import.meta.env.VITE_API_URL,
  appName: import.meta.env.VITE_APP_NAME ?? 'App',
  isDev: import.meta.env.DEV,
};
