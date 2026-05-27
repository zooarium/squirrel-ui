import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '@/api/transactions';
import { useNotification } from '@/context/NotificationContext';

export const TRANSACTIONS_KEY = 'transactions';

export const EMPTY_TRANSACTION = {
  amount: '',
  type: 'expense',
  category_id: '',
  dated: new Date().toISOString().split('T')[0],
  recurring: 0,
};

function toPayload(formData) {
  return {
    amount: parseFloat(formData.amount),
    type: formData.type,
    category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
    dated: new Date(formData.dated).toISOString(),
    recurring: parseInt(formData.recurring, 10),
  };
}

export function useTransactions({
  category_id = '',
  recurring = '',
  dated = '',
  from = '',
  to = '',
} = {}) {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const filters = { category_id, recurring, dated, from, to };

  const { data, isLoading, error } = useQuery({
    queryKey: [TRANSACTIONS_KEY, filters],
    queryFn: () => fetchTransactions(filters),
    select: (res) => ({
      transactions: res.data?.transactions ?? (Array.isArray(res.data) ? res.data : []),
      stats: res.data?.stats ?? {},
    }),
  });

  const transactions = data?.transactions ?? [];
  const stats = data?.stats ?? {};

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });

  const createMutation = useMutation({
    mutationFn: (formData) => createTransaction(toPayload(formData)),
    onSuccess: () => { invalidate(); showNotification('Transaction created successfully!', 'success'); },
    onError: (err) => showNotification(err.message, 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => updateTransaction(id, toPayload(formData)),
    onSuccess: () => { invalidate(); showNotification('Transaction updated successfully!', 'success'); },
    onError: (err) => showNotification(err.message, 'error'),
  });

  const removeMutation = useMutation({
    mutationFn: (id) => deleteTransaction(id),
    onSuccess: () => { invalidate(); showNotification('Transaction deleted successfully!', 'success'); },
    onError: (err) => showNotification(err.message, 'error'),
  });

  return {
    transactions,
    stats,
    isLoading,
    error: error?.message ?? null,
    create: (formData) => createMutation.mutateAsync(formData),
    update: (id, formData) => updateMutation.mutateAsync({ id, formData }),
    remove: (id) => removeMutation.mutateAsync(id),
  };
}
