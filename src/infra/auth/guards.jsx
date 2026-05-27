import React from 'react';
import { Navigate } from 'react-router-dom';
import { storage } from './storage';

export function PrivateRoute({ children }) {
  return storage.getToken() ? children : <Navigate to="/login" replace />;
}

export function PublicRoute({ children }) {
  return !storage.getToken() ? children : <Navigate to="/dashboard" replace />;
}
