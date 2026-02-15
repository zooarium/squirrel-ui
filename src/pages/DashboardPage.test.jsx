import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import DashboardPage from './DashboardPage';

// Mock child components to simplify testing
vi.mock('../components/MatrixRain', () => ({ default: () => <div data-testid="matrix-rain" /> }));
vi.mock('../components/Header', () => ({ default: () => <div data-testid="header" /> }));
vi.mock('../components/ConfirmDialog', () => ({ default: () => <div data-testid="confirm-dialog" /> }));

// Mock the useNotification hook
const showNotificationMock = vi.fn();
vi.mock('../context/NotificationContext', () => ({
  useNotification: () => ({
    showNotification: showNotificationMock,
  }),
}));

// Mock environment variable
vi.stubGlobal('import.meta', { env: { VITE_API_BE_URL: 'http://test-api.com' } });

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('DashboardPage', () => {
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    localStorage.setItem('token', 'fake-token');
    
    // Mock fetch for initial data load
    window.fetch = vi.fn((url, options) => {
      // Mock POST request response
      if (options && options.method === 'POST') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: { id: 123 } }),
          });
      }

      if (url.includes('/transactions')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [] }),
        });
      }
      if (url.includes('/categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [{ id: 1, name: 'Food' }] }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('submits transaction with correct date format', async () => {
    render(
        <DashboardPage />
    );

    // Wait for initial load
    await waitFor(() => expect(screen.getByText('No transactions found.')).toBeInTheDocument());

    // Open modal
    fireEvent.click(screen.getByText('Add your first transaction'));

    // Wait for modal to open and category to be available
    await waitFor(() => expect(screen.getByText(/Add Transaction/i)).toBeInTheDocument());

    // Fill form
    const categoryInputs = screen.getAllByLabelText(/Category/i);
    const modalCategoryInput = categoryInputs.find(input => input.id === 'category_id');
    fireEvent.change(modalCategoryInput, { target: { value: '1' } });
    
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '100' } });
    
    const dateInputs = screen.getAllByLabelText(/Date/i);
    const modalDateInput = dateInputs.find(input => input.id === 'dated');
    fireEvent.change(modalDateInput, { target: { value: '2026-02-15' } });
    
    // Submit
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
        // We expect the fetch to be called for the POST request
        const calls = window.fetch.mock.calls;
        const postCall = calls.find(call => call[1] && call[1].method === 'POST');
        
        expect(postCall).toBeDefined();
        if (postCall) {
            const body = JSON.parse(postCall[1].body);
            // Verify date format is ISO string (RFC3339)
            expect(body.dated).toBe('2026-02-15T00:00:00.000Z');
            expect(body.amount).toBe(100);
            expect(body.category_id).toBe(1);
        }
    });
  });

  it('displays transaction list with dated field', async () => {
    // Override fetch mock for this test to return a transaction
    window.fetch = vi.fn((url, options) => {
        if (url.includes('/transactions') && (!options || !options.method || options.method === 'GET')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    data: {
                        transactions: [{
                            id: 4294967299,
                            app_id: 0,
                            user_id: 2,
                            amount: 50,
                            type: "expense",
                            category_id: 1,
                            recurring: 0,
                            dated: "2026-02-18T00:00:00Z",
                            created_at: "2026-02-15T10:06:33.591243344Z",
                            updated_at: "2026-02-15T10:06:33.591243622Z"
                        }]
                    }
                }),
            });
        }
        if (url.includes('/categories')) {
             return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ data: [{ id: 1, name: 'Food' }] }),
            });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    render(<DashboardPage />);
    
    // Wait for transaction to load
    // The dated field is 2026-02-18. Local date string depends on locale.
    // Assuming en-US or similar where it contains 2026, 2, 18 or similar.
    // To represent this reliably, we can check for the formatted date.
    // In the component: new Date(transaction.dated).toLocaleDateString('en-GB')
    const expectedDate = new Date("2026-02-18T00:00:00Z").toLocaleDateString('en-GB');
    
    await waitFor(() => expect(screen.getByText(expectedDate)).toBeInTheDocument());
    expect(screen.getAllByText('Food').length).toBeGreaterThan(0);
    expect(screen.getByText('expense')).toBeInTheDocument();
  });
});
