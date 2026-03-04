import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import SquirrelLogo from './SquirrelLogo';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const user = (() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showNotification('You have been logged out successfully.', 'success');
    navigate('/login');
  };

  const navLinkClasses = (path) =>
    `transform px-5 py-2 font-bold tracking-wider uppercase transition duration-300 ease-in-out hover:scale-105 focus:shadow-[0_0_15px_rgba(34,197,94,0.6)] focus:outline-none ${
      location.pathname === path
        ? 'rounded bg-green-700 text-black'
        : 'text-green-400 hover:text-white'
    }`;

  return (
    <header className="relative z-10 mb-8 w-full py-4 pr-4">
      <div className="flex items-center justify-between">
        <SquirrelLogo 
          className="transition-transform hover:scale-105 cursor-pointer" 
          onClick={() => navigate('/dashboard')} 
        />
        <div className="flex items-center space-x-4">
          <span className="text-sm text-green-300">Welcome, {user ? user.firstname : 'Agent'}</span>
          <button
            onClick={handleLogout}
            className="transform rounded-full p-2 transition duration-300 ease-in-out hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
            aria-label="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
      <nav className="mt-4 flex items-center space-x-4">
        <button onClick={() => navigate('/dashboard')} className={navLinkClasses('/dashboard')}>
          Transactions
        </button>
        <button onClick={() => navigate('/categories')} className={navLinkClasses('/categories')}>
          Categories
        </button>
      </nav>
    </header>
  );
};

export default Header;
