import { apiRequest } from '@aviary-ui/core';

export function fetchTransactions(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category_id) params.append('category_id', filters.category_id);
  if (filters.recurring) params.append('recurring', filters.recurring);
  if (filters.dated) params.append('dated', filters.dated);
  if (filters.from) params.append('from', filters.from);
  if (filters.to) params.append('to', filters.to);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/transactions${query}`);
}

export function createTransaction(payload) {
  return apiRequest('/transactions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateTransaction(id, payload) {
  return apiRequest(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteTransaction(id) {
  return apiRequest(`/transactions/${id}`, { method: 'DELETE' });
}
