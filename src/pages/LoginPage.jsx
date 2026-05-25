import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { login } from '../api/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user ?? {}));
      navigate('/dashboard');
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page page-center">
      <div className="container container-tight py-4">
        <div className="text-center mb-4">
          <h1 className="fw-bold fs-1 mb-1">Squirrel</h1>
          <p className="text-secondary">Personal Expense Tracker</p>
        </div>

        <div className="card card-md shadow-sm">
          <div className="card-body">
            <h2 className="h3 text-center mb-4">Sign in to your account</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="form-footer">
                <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                  {isLoading && (
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                  )}
                  {isLoading ? 'Signing in…' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center text-secondary mt-3 small">
          &copy; {new Date().getFullYear()} Phoenix Code Labs
        </div>
      </div>
    </div>
  );
}
