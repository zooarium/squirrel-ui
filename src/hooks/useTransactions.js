import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../api/transactions';
import { useNotification } from '../context/NotificationContext';

export const EMPTY_TRANSACTION = {
  amount: '',
  type: 'expense',
  category_id: '',
  dated: new Date().toISOString().split('T')[0],
  recurring: 0,
};

export function useTransactions({ category_id = '', recurring = '', dated = '', from = '', to = '' } = {}) {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchTransactions({ category_id, recurring, dated, from, to });
      setTransactions(data.data?.transactions ?? (Array.isArray(data.data) ? data.data : []));
      setStats(data.data?.stats ?? {});
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [category_id, recurring, dated, from, to, showNotification]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (formData) => {
      const payload = {
        amount: parseFloat(formData.amount),
        type: formData.type,
        category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
        dated: new Date(formData.dated).toISOString(),
        recurring: parseInt(formData.recurring, 10),
      };
      await createTransaction(payload);
      showNotification('Transaction created successfully!', 'success');
      await load();
    },
    [load, showNotification]
  );

  const update = useCallback(
    async (id, formData) => {
      const payload = {
        amount: parseFloat(formData.amount),
        type: formData.type,
        category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
        dated: new Date(formData.dated).toISOString(),
        recurring: parseInt(formData.recurring, 10),
      };
      await updateTransaction(id, payload);
      showNotification('Transaction updated successfully!', 'success');
      await load();
    },
    [load, showNotification]
  );

  const remove = useCallback(
    async (id) => {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showNotification('Transaction deleted successfully!', 'success');
    },
    [showNotification]
  );

  return { transactions, stats, isLoading, error, create, update, remove, refetch: load };
}
