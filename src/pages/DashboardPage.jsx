import React, { useState, useRef, useEffect, useMemo } from 'react';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import AppLayout from '../components/AppLayout';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useTransactions, EMPTY_TRANSACTION } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { useNotification } from '../context/NotificationContext';

const CHART_COLORS = ['#206bc4', '#4299e1', '#74b9ff', '#0ca678', '#2fb344', '#f76707', '#e67700'];

const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

function validateForm(form) {
  const errors = {};
  if (!form.amount) {
    errors.amount = 'Amount is required.';
  } else if (isNaN(form.amount) || Number(form.amount) <= 0) {
    errors.amount = 'Amount must be a positive number.';
  }
  if (form.type === 'expense' && !form.category_id) {
    errors.category_id = 'Category is required for expenses.';
  }
  if (!form.dated) {
    errors.dated = 'Date is required.';
  }
  return errors;
}

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    category_id: '',
    recurring: '',
    dated: '',
    from: '',
    to: '',
  });
  const [activeTab, setActiveTab] = useState('list');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(EMPTY_TRANSACTION);
  const [formErrors, setFormErrors] = useState({});
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });

  const firstInputRef = useRef(null);
  const { showNotification } = useNotification();

  const { transactions, stats, isLoading, error, create, update, remove, refetch } =
    useTransactions(filters);
  const { categories, getCategoryName } = useCategories();

  useEffect(() => {
    if (isModalOpen) firstInputRef.current?.focus();
  }, [isModalOpen]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { id, value, type, checked } = e.target;
    const val = type === 'checkbox' ? (checked ? 1 : 0) : value;
    setFormData((prev) => ({ ...prev, [id]: val }));
    if (formErrors[id]) setFormErrors((prev) => ({ ...prev, [id]: null }));
  };

  const openAdd = () => {
    setIsEditMode(false);
    setFormData(EMPTY_TRANSACTION);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (transaction) => {
    setIsEditMode(true);
    setFormData({
      ...transaction,
      category_id: transaction.category_id ?? '',
      dated: transaction.dated
        ? transaction.dated.split('T')[0]
        : EMPTY_TRANSACTION.dated,
      recurring: transaction.recurring ?? 0,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData(EMPTY_TRANSACTION);
    setFormErrors({});
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      if (isEditMode) {
        await update(formData.id, formData);
      } else {
        await create(formData);
      }
      closeModal();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteRequest = (transaction) => {
    setConfirmState({
      isOpen: true,
      message: `Delete transaction #${transaction.id}? This cannot be undone.`,
      onConfirm: async () => {
        try {
          await remove(transaction.id);
        } catch (err) {
          showNotification(err.message, 'error');
        } finally {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const pieData = useMemo(
    () =>
      stats.category_wise_amount_sum?.map((item) => ({
        name: getCategoryName(item.category_id),
        value: item.total_sum,
      })) ?? [],
    [stats, getCategoryName]
  );

  const barData1 = useMemo(
    () =>
      stats.category_top_10_by_amount_sum?.map((item) => ({
        name: getCategoryName(item.category_id),
        total_sum: item.total_sum,
      })) ?? [],
    [stats, getCategoryName]
  );

  const barData2 = useMemo(
    () =>
      stats.top_10_by_amount?.map((item) => ({
        name: `${getCategoryName(item.category_id)} (${new Date(item.dated).toLocaleDateString('en-GB')})`,
        amount: item.amount,
        type: item.type,
      })) ?? [],
    [stats, getCategoryName]
  );

  return (
    <AppLayout>
      {/* Page header */}
      <div className="page-header d-print-none mb-3">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="page-title">Transactions</h2>
          </div>
          <div className="col-auto ms-auto">
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={openAdd}
            >
              <IconPlus size={16} />
              New Transaction
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            List
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'charts' ? 'active' : ''}`}
            onClick={() => setActiveTab('charts')}
          >
            Visualizations
          </button>
        </li>
      </ul>

      {activeTab === 'list' && (
        <>
          {/* Filters */}
          <div className="card mb-3">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-3 col-sm-6">
                  <label className="form-label">Category</label>
                  <select
                    name="category_id"
                    className="form-select"
                    value={filters.category_id}
                    onChange={handleFilterChange}
                  >
                    <option value="">All categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 col-sm-6">
                  <label className="form-label">Date Range</label>
                  <select
                    name="dated"
                    className="form-select"
                    value={filters.dated}
                    onChange={handleFilterChange}
                  >
                    <option value="">All time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="this month">This Month</option>
                    <option value="last month">Last Month</option>
                    <option value="this year">This Year</option>
                    <option value="last year">Last Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                {filters.dated === 'custom' && (
                  <>
                    <div className="col-md-2 col-sm-6">
                      <label className="form-label">From</label>
                      <input
                        type="date"
                        name="from"
                        className="form-control"
                        value={filters.from}
                        onChange={handleFilterChange}
                      />
                    </div>
                    <div className="col-md-2 col-sm-6">
                      <label className="form-label">To</label>
                      <input
                        type="date"
                        name="to"
                        className="form-control"
                        value={filters.to}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </>
                )}
                <div className="col-auto">
                  <label className="form-check mb-0">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={filters.recurring === '1'}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          recurring: e.target.checked ? '1' : '',
                        }))
                      }
                    />
                    <span className="form-check-label">Recurring only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions table */}
          <div className="card">
            <div className="card-body p-0">
              {isLoading ? (
                <div className="d-flex justify-content-center align-items-center p-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading…</span>
                  </div>
                </div>
              ) : error ? (
                <div className="p-4 text-center">
                  <p className="text-danger mb-3">{error}</p>
                  <button className="btn btn-outline-danger" onClick={refetch}>
                    Retry
                  </button>
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-5 text-center text-secondary">
                  <p className="mb-3">No transactions found.</p>
                  <button className="btn btn-primary" onClick={openAdd}>
                    Add first transaction
                  </button>
                </div>
              ) : (
                <table className="table table-vcenter table-hover card-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th className="w-1" />
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr key={t.id}>
                        <td className="fw-medium">{getCategoryName(t.category_id)}</td>
                        <td>{formatINR(t.amount)}</td>
                        <td>
                          <span
                            className={`badge ${t.type === 'income' ? 'bg-success-lt' : 'bg-danger-lt'}`}
                          >
                            {t.type}
                          </span>
                        </td>
                        <td className="text-secondary">
                          {new Date(t.dated).toLocaleDateString('en-GB')}
                        </td>
                        <td>
                          <div className="d-flex gap-2 justify-content-end">
                            <button
                              className="btn btn-sm btn-ghost-primary btn-icon"
                              onClick={() => openEdit(t)}
                              title="Edit"
                            >
                              <IconEdit size={16} />
                            </button>
                            <button
                              className="btn btn-sm btn-ghost-danger btn-icon"
                              onClick={() => handleDeleteRequest(t)}
                              title="Delete"
                            >
                              <IconTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'charts' && (
        <div className="row row-cards">
          {/* Pie: expense distribution */}
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Expense Distribution by Category</h3>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatINR(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bar: top categories */}
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Top Categories by Spending</h3>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData1} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={140}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip formatter={(v) => formatINR(v)} />
                    <Bar dataKey="total_sum" radius={[0, 4, 4, 0]}>
                      {barData1.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bar: top transactions */}
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Top Transactions by Amount</h3>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={barData2}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => formatINR(v)} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="amount" name="Amount" radius={[4, 4, 0, 0]}>
                      {barData2.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.type === 'income' ? '#2fb344' : '#d63939'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditMode ? 'Edit Transaction' : 'Add Transaction'}
      >
        <form onSubmit={handleSave} noValidate>
          <div className="mb-3">
            <label className="form-label" htmlFor="category_id">
              Category
            </label>
            <select
              id="category_id"
              ref={firstInputRef}
              className={`form-select ${formErrors.category_id ? 'is-invalid' : ''}`}
              value={formData.category_id}
              onChange={handleFormChange}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {formErrors.category_id && (
              <div className="invalid-feedback">{formErrors.category_id}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="amount">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              className={`form-control ${formErrors.amount ? 'is-invalid' : ''}`}
              value={formData.amount}
              onChange={handleFormChange}
            />
            {formErrors.amount && <div className="invalid-feedback">{formErrors.amount}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="dated">
              Date
            </label>
            <input
              id="dated"
              type="date"
              className={`form-control ${formErrors.dated ? 'is-invalid' : ''}`}
              value={formData.dated}
              onChange={handleFormChange}
            />
            {formErrors.dated && <div className="invalid-feedback">{formErrors.dated}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="type">
              Type
            </label>
            <select
              id="type"
              className="form-select"
              value={formData.type}
              onChange={handleFormChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="form-check">
              <input
                id="recurring"
                type="checkbox"
                className="form-check-input"
                checked={formData.recurring === 1}
                onChange={handleFormChange}
              />
              <span className="form-check-label">Recurring transaction</span>
            </label>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditMode ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
      />
    </AppLayout>
  );
}
