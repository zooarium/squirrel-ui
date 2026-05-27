import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/api/categories';
import { useNotification } from '@aviary-ui/ui';

export const CATEGORIES_KEY = 'categories';

export function useCategories({ name = '' } = {}) {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const { data, isLoading, error } = useQuery({
    queryKey: [CATEGORIES_KEY, { name }],
    queryFn: () => fetchCategories({ name }),
    select: (res) => res.data?.categories ?? (Array.isArray(res.data) ? res.data : []),
  });

  const categories = data ?? [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });

  const createMutation = useMutation({
    mutationFn: (categoryName) => createCategory({ name: categoryName, status: 1 }),
    onSuccess: () => { invalidate(); showNotification('Category added successfully!', 'success'); },
    onError: (err) => showNotification(err.message, 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name: categoryName, status }) => updateCategory(id, { name: categoryName, status }),
    onSuccess: () => { invalidate(); showNotification('Category updated successfully!', 'success'); },
    onError: (err) => showNotification(err.message, 'error'),
  });

  const removeMutation = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => { invalidate(); showNotification('Category deleted successfully!', 'success'); },
    onError: (err) => showNotification(err.message, 'error'),
  });

  const getCategoryName = (categoryId) =>
    categories.find((c) => c.id === categoryId)?.name ?? 'N/A';

  return {
    categories,
    isLoading,
    error: error?.message ?? null,
    create: (name) => createMutation.mutateAsync(name),
    update: (id, name, status) => updateMutation.mutateAsync({ id, name, status }),
    remove: (id) => removeMutation.mutateAsync(id),
    getCategoryName,
  };
}
