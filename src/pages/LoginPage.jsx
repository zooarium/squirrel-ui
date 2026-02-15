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
    <div className="flex min-h-screen items-center justify-center bg-black p-4 font-mono text-green-400">
      <MatrixRain />
      
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Branding & Features */}
        <div className="space-y-8 p-6">
          <header className="text-left">
            <h1 className="text-shadow-glow animate-pulse text-6xl font-bold tracking-widest uppercase mb-2">
              Vyaya
            </h1>
            <p className="text-xl font-bold text-green-500">Personal Expense Tracker & Financial Matrix.</p>
          </header>

          <div className="border border-green-900/50 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(34,197,94,0.2)]">
             <img 
               src="/images/login-feature.jpg" 
               alt="Matrix-themed Expense Dashboard" 
               className="w-full h-auto opacity-80 hover:opacity-100 transition-opacity duration-300 object-cover max-h-[300px]"
             />
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-green-300 border-b border-green-800 pb-2">System Capabilities</h3>
            <ul className="space-y-3">
              {[
                "Track Daily Expenses & Income Streams",
                "Visualize Spending Patterns & Trends",
                "Smart Categorization of Transactions",
                "Secure Personal Financial Data Vault"
              ].map((feature, index) => (
                <li key={index} className="flex items-center space-x-3 text-green-400/90">
                  <span className="text-green-500">➜</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full max-w-md mx-auto rounded-lg border border-green-600 bg-black/90 p-8 shadow-[0_0_25px_rgba(34,197,94,0.4)] backdrop-blur-md">
          <h2 className="text-shadow-glow mb-8 text-center text-3xl font-semibold text-green-400 uppercase tracking-wider">
            Access Terminal
          </h2>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold text-green-400 uppercase tracking-wide">
                Operator ID (Email)
              </label>
              <input
                type="email"
                id="email"
                className="w-full appearance-none rounded border border-green-600 bg-black px-4 py-3 leading-tight text-green-300 shadow transition-all duration-300 focus:border-green-400 focus:shadow-[0_0_15px_rgba(34,197,94,0.5)] focus:outline-none placeholder-green-800"
                placeholder="neo@matrix.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-bold text-green-400 uppercase tracking-wide">
                Access Code (Password)
              </label>
              <input
                type="password"
                id="password"
                className="w-full appearance-none rounded border border-green-600 bg-black px-4 py-3 leading-tight text-green-300 shadow transition-all duration-300 focus:border-green-400 focus:shadow-[0_0_15px_rgba(34,197,94,0.5)] focus:outline-none placeholder-green-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-center pt-4">
              <button
                type="submit"
                className="w-full transform rounded bg-green-700 px-6 py-4 font-bold tracking-widest text-black uppercase transition duration-300 ease-in-out hover:scale-105 hover:bg-green-600 hover:shadow-[0_0_20px_rgba(34,197,94,0.8)] focus:outline-none"
              >
                Enter the Matrix
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-xs text-green-600">
             <p>Restricted Access. Unauthorized entry is prohibited.</p>
          </div>
        </div>
      </div>
      
      <footer className="fixed bottom-4 left-0 w-full text-center text-xs text-green-800 opacity-60 pointer-events-none">
        <p>&copy; {new Date().getFullYear()} Phoenix Code Labs. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
