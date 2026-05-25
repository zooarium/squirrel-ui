import { useState, useEffect, useCallback } from 'react';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/categories';
import { useNotification } from '../context/NotificationContext';

export function useCategories({ name = '' } = {}) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchCategories({ name });
      setCategories(data.data?.categories ?? (Array.isArray(data.data) ? data.data : []));
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [name, showNotification]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (categoryName) => {
      const data = await createCategory({ name: categoryName, status: 1 });
      setCategories((prev) => [...prev, data.data]);
      showNotification('Category added successfully!', 'success');
    },
    [showNotification]
  );

  const update = useCallback(
    async (id, categoryName, status) => {
      const data = await updateCategory(id, { name: categoryName, status });
      setCategories((prev) => prev.map((c) => (c.id === id ? data.data : c)));
      showNotification('Category updated successfully!', 'success');
    },
    [showNotification]
  );

  const remove = useCallback(
    async (id) => {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showNotification('Category deleted successfully!', 'success');
    },
    [showNotification]
  );

  const getCategoryName = useCallback(
    (categoryId) => categories.find((c) => c.id === categoryId)?.name ?? 'N/A',
    [categories]
  );

  return { categories, isLoading, error, create, update, remove, getCategoryName, refetch: load };
}
