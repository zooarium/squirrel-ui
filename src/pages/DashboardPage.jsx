import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import MatrixRain from '../components/MatrixRain';
import ConfirmDialog from '../components/ConfirmDialog';
import Header from '../components/Header'; // Assuming Header is in components

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState({
    amount: '',
    type: 'expense',
    category_id: '',
  });
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });
  const [formErrors, setFormErrors] = useState({});

  const { showNotification } = useNotification();

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const apiUrl = `${import.meta.env.VITE_API_BE_URL}/transactions`;
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data.data || []);
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = `${import.meta.env.VITE_API_BE_URL}/categories`;
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.data || []);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCurrentTransaction({ ...currentTransaction, [id]: value });
    if (formErrors[id]) {
      setFormErrors({ ...formErrors, [id]: null });
    }
  };

  const handleOpenModal = (transaction = null) => {
    if (transaction) {
      setIsEditMode(true);
      setCurrentTransaction({
        ...transaction,
        category_id: transaction.category_id || '',
      });
    } else {
      setIsEditMode(false);
      setCurrentTransaction({
        amount: '',
        type: 'expense',
        category_id: '',
      });
    }
    setFormErrors({});
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentTransaction({
      amount: '',
      type: 'expense',
      category_id: '',
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!currentTransaction.amount) {
      errors.amount = 'Amount is required.';
    } else if (isNaN(currentTransaction.amount) || Number(currentTransaction.amount) <= 0) {
      errors.amount = 'Amount must be a positive number.';
    }
    if (currentTransaction.type === 'expense' && !currentTransaction.category_id) {
      errors.category_id = 'Category is required for expenses.';
    }
    return errors;
  };

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const { amount, type, category_id } = currentTransaction;

    const payload = {
      amount: parseFloat(amount),
      type,
      category_id: category_id ? parseInt(category_id, 10) : null,
    };

    const url = isEditMode
      ? `${import.meta.env.VITE_API_BE_URL}/transactions/${currentTransaction.id}`
      : `${import.meta.env.VITE_API_BE_URL}/transactions`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to ${isEditMode ? 'update' : 'create'} transaction`
        );
      }
      showNotification(
        `Transaction ${isEditMode ? 'updated' : 'created'} successfully!`,
        'success'
      );
      handleCloseModal();
      fetchTransactions();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteRequest = (transaction) => {
    setConfirmState({
      isOpen: true,
      message: `Are you sure you want to delete this transaction (ID: ${transaction.id})?`,
      onConfirm: () => handleDeleteTransaction(transaction.id),
    });
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = `${import.meta.env.VITE_API_BE_URL}/transactions/${id}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status !== 204) throw new Error('Failed to delete transaction');
      setTransactions(transactions.filter((t) => t.id !== id));
      showNotification('Transaction deleted successfully!', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setConfirmState({ isOpen: false, message: '', onConfirm: () => {} });
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : 'N/A';
  };

  return (
    <div className="min-h-screen bg-black p-8 font-mono text-green-400">
      <MatrixRain />
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState({ isOpen: false, message: '', onConfirm: () => {} })}
      />
      <div className="relative z-10 mx-auto max-w-7xl">
        <Header />

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-shadow-glow text-3xl font-bold">Transactions</h2>
          <button
            onClick={() => handleOpenModal()}
            className="transform rounded-full bg-green-700 p-3 font-bold text-black transition duration-300 ease-in-out hover:scale-110 hover:bg-green-600 focus:shadow-[0_0_15px_rgba(34,197,94,0.6)] focus:outline-none"
            aria-label="New Transaction"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-lg">
            Loading Transactions...
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-red-500">Error: {error}</div>
        ) : (
          <main>
            <div className="overflow-x-auto rounded-lg border border-green-600 bg-black/80 shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-sm">
              <table className="min-w-full divide-y divide-green-700">
                                <thead className="bg-black/50">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-300 uppercase"
                                    >
                                      Category
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-300 uppercase"
                                    >
                                      Amount
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-300 uppercase"
                                    >
                                      Type
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-300 uppercase"
                                    >
                                      Date
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                      <span className="sr-only">Actions</span>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-green-800">
                                  {transactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-green-900/20">
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        {getCategoryName(transaction.category_id)}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        {new Intl.NumberFormat('en-IN', {
                                          style: 'currency',
                                          currency: 'INR',
                                        }).format(transaction.amount)}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                            transaction.type === 'income'
                                              ? 'bg-green-700 text-green-100'
                                              : 'bg-red-700 text-red-100'
                                          }`}
                                        >
                                          {transaction.type}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(transaction.created_at).toLocaleDateString()}
                                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                        <button
                          onClick={() => handleOpenModal(transaction)}
                          className="text-blue-400 hover:text-blue-300"
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path
                              fillRule="evenodd"
                              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(transaction)}
                          className="ml-4 text-red-500 hover:text-red-400"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        )}
      </div>

      {isModalOpen && (
        <div
          className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-md rounded-lg border border-green-600 bg-black/80 p-8 shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-green-400 transition-colors hover:text-white"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-shadow-glow mb-6 text-2xl font-bold">
              {isEditMode ? 'Edit' : 'Add'} Transaction
            </h2>
            <form onSubmit={handleSaveTransaction} noValidate>
              <div className="mb-6">
                <label htmlFor="category_id" className="mb-2 block text-sm font-bold">
                  Category
                </label>
                <select
                  id="category_id"
                  value={currentTransaction.category_id}
                  onChange={handleInputChange}
                  className={`w-full appearance-none rounded border bg-black px-4 py-3 leading-tight text-green-300 shadow focus:shadow-[0_0_10px_rgba(34,197,94,0.5)] focus:outline-none ${formErrors.category_id ? 'border-red-500 focus:border-red-500' : 'border-green-600 focus:border-green-400'}`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {formErrors.category_id && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.category_id}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="amount" className="mb-2 block text-sm font-bold">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  value={currentTransaction.amount}
                  onChange={handleInputChange}
                  className={`w-full appearance-none rounded border bg-black px-4 py-3 leading-tight text-green-300 shadow focus:shadow-[0_0_10px_rgba(34,197,94,0.5)] focus:outline-none ${formErrors.amount ? 'border-red-500 focus:border-red-500' : 'border-green-600 focus:border-green-400'}`}
                />
                {formErrors.amount && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.amount}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="type" className="mb-2 block text-sm font-bold">
                  Type
                </label>
                <select
                  id="type"
                  value={currentTransaction.type}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded border border-green-600 bg-black px-4 py-3 leading-tight text-green-300 shadow focus:border-green-400 focus:shadow-[0_0_10px_rgba(34,197,94,0.5)] focus:outline-none"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="transform rounded bg-green-700 px-6 py-2 font-bold tracking-wider text-black uppercase transition hover:bg-green-600 focus:shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
