// HTTP client — swap fetch → axios: edit here only.
import { config } from '@/infra/config';
import { storage } from '@/infra/auth/storage';
import { AuthError, NetworkError } from '@/infra/http/errors';

export function clearAuth() {
  storage.clear();
}

// --- Refresh token state ---
// Prevents concurrent refresh storms: if 3 requests 401 simultaneously,
// only one refresh call fires; the other two queue and retry with the new token.
let isRefreshing = false;
let refreshQueue = [];

function drainQueue(newToken) {
  refreshQueue.forEach((cb) => cb(newToken));
  refreshQueue = [];
}

async function doRefresh() {
  const refreshToken = storage.getRefreshToken();
  if (!refreshToken) throw new AuthError();

  const res = await fetch(`${config.authBase}${config.refreshPath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) throw new AuthError();

  const body = await res.json();
  const newToken = body?.data?.token ?? body?.token;
  if (!newToken) throw new AuthError();

  storage.setToken(newToken);
  if (body?.data?.refresh_token) storage.setRefreshToken(body.data.refresh_token);

  return newToken;
}

async function parseResponse(res) {
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) {
    throw new NetworkError(
      data?.error || data?.message || `Request failed (${res.status})`,
      res.status
    );
  }
  return data;
}

async function retryWithToken(url, options, newToken) {
  const res = await fetch(url, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${newToken}` },
  });
  if (res.status === 401) {
    clearAuth();
    window.location.href = '/login';
    throw new AuthError();
  }
  return parseResponse(res);
}

async function request(baseUrl, path, options = {}, skipAuthRefresh = false) {
  const token = storage.getToken();

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const url = `${baseUrl}${path}`;
  const res = await fetch(url, { ...options, headers });

  // Auth endpoints (login, register) must NOT trigger the refresh flow.
  // A 401 from login just means bad credentials — let the error propagate normally.
  if (res.status !== 401 || skipAuthRefresh) return parseResponse(res);

  // --- 401 handling: try silent refresh ---
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const newToken = await doRefresh();
      isRefreshing = false;
      drainQueue(newToken);
      return retryWithToken(url, { ...options, headers }, newToken);
    } catch {
      isRefreshing = false;
      drainQueue(null);
      clearAuth();
      window.location.href = '/login';
      throw new AuthError();
    }
  }

  // Another request is already refreshing — queue this one and wait
  return new Promise((resolve, reject) => {
    refreshQueue.push((newToken) => {
      if (!newToken) return reject(new AuthError());
      retryWithToken(url, { ...options, headers }, newToken).then(resolve).catch(reject);
    });
  });
}

export const apiRequest = (path, options = {}) => request(config.apiBase, path, options, false);
export const authRequest = (path, options = {}) => request(config.authBase, path, options, true);
