import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const generateMatrixRainDrops = () => {
  return Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}vw`,
    top: `${Math.random() * 100}vh`,
    animationDuration: `${Math.random() * 2 + 3}s`,
    animationDelay: `-${Math.random() * 5}s`,
    character: String.fromCharCode(0x30a0 + Math.random() * 96),
  }));
};

const matrixRainDrops = generateMatrixRainDrops();

const LoginPage = () => {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('password123');
  const navigate = useNavigate();

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
          navigate('/dashboard');
        } else {
          alert('Login failed: Invalid response structure');
        }
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 font-mono text-green-400">
      <div className="absolute top-0 left-0 -z-10 h-full w-full overflow-hidden">
        {/* Matrix Rain Effect - Simplified for illustration */}
        <div className="matrix-rain pointer-events-none absolute inset-0 opacity-20">
          {matrixRainDrops.map((drop) => (
            <span
              key={drop.id}
              className="text-shadow-glow absolute text-xs"
              style={{
                left: drop.left,
                top: drop.top,
                animation: `matrix-fall ${drop.animationDuration} linear infinite`,
                animationDelay: drop.animationDelay,
              }}
            >
              {drop.character}
            </span>
          ))}
        </div>
      </div>

      <header className="relative z-10 mb-8 text-center">
        <h1 className="text-shadow-glow animate-pulse text-5xl font-bold tracking-widest uppercase">
          Vyaya-UI
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
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="transform rounded bg-green-700 px-6 py-3 font-bold tracking-wider text-black uppercase transition duration-300 ease-in-out hover:scale-105 hover:bg-green-600 focus:shadow-[0_0_15px_rgba(34,197,94,0.6)] focus:outline-none"
            >
              Enter the Matrix
            </button>
            <a
              href="#"
              className="inline-block align-baseline text-sm font-bold text-green-400 transition-colors hover:text-green-200"
            >
              Forgot Password?
            </a>
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
