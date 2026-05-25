const API_URL = import.meta.env.VITE_API_BE_URL;
const AUTH_URL = import.meta.env.VITE_API_URL;

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

async function request(baseUrl, path, options = {}) {
  const token = localStorage.getItem('token');

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
    throw new Error('Session expired. Please log in again.');
  }

  if (response.status === 204) return null;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Request failed (${response.status})`);
  }

  return data;
}

export const apiRequest = (path, options = {}) => request(API_URL, path, options);
export const authRequest = (path, options = {}) => request(AUTH_URL, path, options);
