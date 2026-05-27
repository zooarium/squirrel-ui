import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { storage } from '../infra/auth/storage';
import { login } from '../api/auth';
import { Button, Card, CardBody, FormField, Input } from '../ui';

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
      storage.setToken(data.token);
      storage.setUser(data.user ?? {});
      navigate('/dashboard');
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
      <div className="container container-tight py-4">
        <div className="text-center mb-4">
          <h1 className="fw-bold fs-1 mb-1">Squirrel</h1>
          <p className="text-secondary">Personal Expense Tracker</p>
        </div>

        <Card className="card-md shadow-sm">
          <CardBody>
            <h2 className="h3 text-center mb-4">Sign in to your account</h2>
            <form onSubmit={handleSubmit} noValidate>
              <FormField label="Email address" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </FormField>
              <FormField label="Password" htmlFor="password">
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </FormField>
              <div className="form-footer">
                <Button type="submit" loading={isLoading} className="w-100">
                  {isLoading ? 'Signing in…' : 'Sign in'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <div className="text-center text-secondary mt-3 small">
          &copy; {new Date().getFullYear()} Phoenix Code Labs
        </div>
      </div>
    </div>
  );
}
