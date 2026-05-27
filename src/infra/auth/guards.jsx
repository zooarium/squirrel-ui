import React from 'react';
import { Navigate } from 'react-router-dom';
import { storage } from './storage';

// PrivateRoute — requires auth token. Redirects to /login if not authenticated.
export function PrivateRoute({ children }) {
  return storage.getToken() ? children : <Navigate to="/login" replace />;
}

// PublicRoute — for login/register pages. Redirects to /dashboard if already authenticated.
export function PublicRoute({ children }) {
  return !storage.getToken() ? children : <Navigate to="/dashboard" replace />;
}

// RequireRole — renders children only if user.role matches.
// Usage: <RequireRole role="admin"><AdminPanel /></RequireRole>
// Optional fallback: <RequireRole role="admin" fallback={<p>No access</p>}>…
export function RequireRole({ role, children, fallback = null }) {
  const user = storage.getUser();
  if (!user?.role || user.role !== role) return fallback;
  return children;
}

// RequirePermission — renders children only if user.permissions includes the given permission.
// Usage: <RequirePermission permission="transactions:write"><CreateButton /></RequirePermission>
// Expects user.permissions to be a string[].
export function RequirePermission({ permission, children, fallback = null }) {
  const user = storage.getUser();
  if (!Array.isArray(user?.permissions) || !user.permissions.includes(permission)) return fallback;
  return children;
}
