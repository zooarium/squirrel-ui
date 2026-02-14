import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import MatrixRain from '../components/MatrixRain';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('password123');
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          showNotification('Login successful!', 'success');
          navigate('/dashboard');
        } else {
          showNotification('Login failed: Invalid response structure', 'error');
        }
      } else {
        showNotification('Login failed. Please check your credentials.', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showNotification('An error occurred during login.', 'error');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 font-mono text-green-400">
      <MatrixRain />
      <header className="relative z-10 mb-8 text-center">
        <h1 className="text-shadow-glow animate-pulse text-5xl font-bold tracking-widest uppercase">
          Vyaya
        </h1>
        <p className="mt-2 text-sm font-bold text-green-500">Unlocking the digital realm.</p>
      </header>

      <main className="relative z-10 w-full max-w-md rounded-lg border border-green-600 bg-black/80 p-8 shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-sm">
        <h2 className="text-shadow-glow mb-6 text-center text-3xl font-semibold text-green-400">
          Login
        </h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-bold text-green-400">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full appearance-none rounded border border-green-600 bg-black px-4 py-3 leading-tight text-green-300 shadow transition-shadow duration-300 focus:border-green-400 focus:shadow-[0_0_10px_rgba(34,197,94,0.5)] focus:outline-none"
              placeholder="neo@matrix.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-bold text-green-400">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full appearance-none rounded border border-green-600 bg-black px-4 py-3 leading-tight text-green-300 shadow transition-shadow duration-300 focus:border-green-400 focus:shadow-[0_0_10px_rgba(34,197,94,0.5)] focus:outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="transform rounded bg-green-700 px-6 py-3 font-bold tracking-wider text-black uppercase transition duration-300 ease-in-out hover:scale-105 hover:bg-green-600 focus:shadow-[0_0_15px_rgba(34,197,94,0.6)] focus:outline-none"
            >
              Enter the Matrix
            </button>
          </div>
        </form>
      </main>

      <footer className="relative z-10 mt-8 text-center text-xs text-green-500 opacity-80">
        <p>&copy; {new Date().getFullYear()} Phoenix Code Labs. All rights reserved.</p>
        <p>A journey into the digital consciousness.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
