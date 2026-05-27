// Single source for all env vars and feature flags.
// No import.meta.env.* outside this file.
export const config = {
  apiBase: import.meta.env.VITE_API_BE_URL,
  authBase: import.meta.env.VITE_API_URL,
  appName: import.meta.env.VITE_APP_NAME ?? 'App',
  isDev: import.meta.env.DEV,
  // Path on authBase that issues a new access token from a refresh token.
  // Set VITE_REFRESH_PATH in .env to override. Omit if your API has no refresh endpoint.
  refreshPath: import.meta.env.VITE_REFRESH_PATH ?? '/users/refresh',
};
