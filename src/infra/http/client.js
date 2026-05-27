// HTTP client — swap fetch → axios: edit here only.
import { config } from '../config';
import { storage } from '../auth/storage';
import { AuthError, NetworkError } from './errors';

export function clearAuth() {
  storage.clear();
}

async function request(baseUrl, path, options = {}) {
  const token = storage.getToken();

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${baseUrl}${path}`, { ...options, headers });

  if (response.status === 401) {
    clearAuth();
    window.location.href = '/login';
    throw new AuthError();
  }

  if (response.status === 204) return null;

  const data = await response.json();

  if (!response.ok) {
    throw new NetworkError(
      data?.error || data?.message || `Request failed (${response.status})`,
      response.status
    );
  }

  return data;
}

export const apiRequest = (path, options = {}) => request(config.apiBase, path, options);
export const authRequest = (path, options = {}) => request(config.authBase, path, options);
