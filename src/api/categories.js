import { apiRequest } from '@/infra/http/client';

export function fetchCategories(filters = {}) {
  const params = new URLSearchParams();
  if (filters.name) params.append('name', filters.name);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/categories${query}`);
}

export function createCategory(payload) {
  return apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateCategory(id, payload) {
  return apiRequest(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteCategory(id) {
  return apiRequest(`/categories/${id}`, { method: 'DELETE' });
}
