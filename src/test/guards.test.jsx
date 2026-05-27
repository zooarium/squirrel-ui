import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RequireRole, RequirePermission } from '../infra/auth/guards';
import { storage } from '../infra/auth/storage';

afterEach(() => storage.clear());

describe('RequireRole', () => {
  it('renders children when role matches', () => {
    storage.setUser({ role: 'admin' });
    render(
      <MemoryRouter>
        <RequireRole role="admin">
          <div>Admin Area</div>
        </RequireRole>
      </MemoryRouter>
    );
    expect(screen.getByText('Admin Area')).toBeInTheDocument();
  });

  it('renders fallback when role does not match', () => {
    storage.setUser({ role: 'user' });
    render(
      <MemoryRouter>
        <RequireRole role="admin" fallback={<div>Access Denied</div>}>
          <div>Admin Area</div>
        </RequireRole>
      </MemoryRouter>
    );
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Admin Area')).not.toBeInTheDocument();
  });

  it('renders nothing (null) when no fallback provided and role mismatch', () => {
    storage.setUser({ role: 'user' });
    const { container } = render(
      <MemoryRouter>
        <RequireRole role="admin">
          <div>Admin Area</div>
        </RequireRole>
      </MemoryRouter>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders fallback when no user stored', () => {
    render(
      <MemoryRouter>
        <RequireRole role="admin" fallback={<div>Not logged in</div>}>
          <div>Admin Area</div>
        </RequireRole>
      </MemoryRouter>
    );
    expect(screen.getByText('Not logged in')).toBeInTheDocument();
  });
});

describe('RequirePermission', () => {
  it('renders children when permission exists', () => {
    storage.setUser({ permissions: ['transactions:write', 'categories:read'] });
    render(
      <MemoryRouter>
        <RequirePermission permission="transactions:write">
          <button>Create Transaction</button>
        </RequirePermission>
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: 'Create Transaction' })).toBeInTheDocument();
  });

  it('hides children when permission missing', () => {
    storage.setUser({ permissions: ['categories:read'] });
    render(
      <MemoryRouter>
        <RequirePermission permission="transactions:write">
          <button>Create Transaction</button>
        </RequirePermission>
      </MemoryRouter>
    );
    expect(screen.queryByRole('button', { name: 'Create Transaction' })).not.toBeInTheDocument();
  });

  it('hides children when user has no permissions array', () => {
    storage.setUser({ role: 'user' });
    render(
      <MemoryRouter>
        <RequirePermission permission="transactions:write">
          <button>Create Transaction</button>
        </RequirePermission>
      </MemoryRouter>
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
