import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationProvider } from '@aviary-ui/ui';
import { useCategories } from '../hooks/useCategories';

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>{children}</NotificationProvider>
      </QueryClientProvider>
    );
  };
}

describe('useCategories', () => {
  it('starts in loading state then resolves categories', async () => {
    const { result } = renderHook(() => useCategories(), { wrapper: makeWrapper() });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.categories).toHaveLength(3);
    expect(result.current.categories[0]).toMatchObject({ id: 1, name: 'Food' });
  });

  it('getCategoryName returns name for known id', async () => {
    const { result } = renderHook(() => useCategories(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.getCategoryName(2)).toBe('Transport');
  });

  it('getCategoryName returns N/A for unknown id', async () => {
    const { result } = renderHook(() => useCategories(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.getCategoryName(999)).toBe('N/A');
  });

  it('returns no error on successful fetch', async () => {
    const { result } = renderHook(() => useCategories(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeNull();
  });
});
