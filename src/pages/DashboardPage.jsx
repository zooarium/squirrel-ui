import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="mb-8 text-4xl font-bold">
        Welcome, {user ? user.firstname : 'to the Dashboard'}!
      </h1>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/categories')}
          className="transform rounded bg-blue-600 px-6 py-3 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 focus:outline-none"
        >
          Manage Categories
        </button>
        <button
          onClick={handleLogout}
          className="transform rounded bg-red-600 px-6 py-3 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-red-700 focus:outline-none"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
