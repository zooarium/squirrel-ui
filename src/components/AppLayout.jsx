import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '@/context/NotificationContext';
import { useTheme } from '@/context/ThemeContext';
import { storage } from '@/infra/auth/storage';
import { Button, IconLayoutDashboard, IconTag, IconLogout, IconMenu2, IconSun, IconMoon } from '@/ui';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Transactions', Icon: IconLayoutDashboard },
  { path: '/categories', label: 'Categories', Icon: IconTag },
];

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = storage.getUser();
  const { theme, toggle } = useTheme();

  const handleLogout = () => {
    storage.clear();
    showNotification('Logged out successfully.', 'success');
    navigate('/login');
  };

  const handleNav = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="page">
      <aside className="navbar navbar-vertical navbar-expand-lg">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <IconMenu2 size={20} />
          </button>

          <div className="navbar-brand">
            <button
              className="btn btn-link navbar-brand p-0 text-decoration-none fw-bold"
              onClick={() => handleNav('/dashboard')}
            >
              Squirrel
            </button>
          </div>

          <div className={`collapse navbar-collapse ${sidebarOpen ? 'show' : ''}`}>
            <ul className="navbar-nav pt-lg-3">
              {NAV_ITEMS.map(({ path, label, Icon }) => (
                <li key={path} className="nav-item">
                  <button
                    className={`nav-link btn btn-link w-100 text-start ${location.pathname === path ? 'active' : ''}`}
                    onClick={() => handleNav(path)}
                  >
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      <Icon size={20} />
                    </span>
                    <span className="nav-link-title">{label}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-auto border-top pt-3 pb-2 px-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="overflow-hidden">
                  <div className="fw-medium text-truncate">
                    {user?.firstname ?? 'User'}
                  </div>
                  <div className="text-secondary small text-truncate">
                    {user?.email ?? ''}
                  </div>
                </div>
                <div className="d-flex gap-1 ms-2 flex-shrink-0">
                  <Button
                    variant="ghost-secondary"
                    icon
                    onClick={toggle}
                    title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
                  >
                    {theme === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
                  </Button>
                  <Button
                    variant="ghost-danger"
                    icon
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <IconLogout size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="page-wrapper">
        <div className="page-body">
          <div className="container-xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
