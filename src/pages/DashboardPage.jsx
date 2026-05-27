import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import {
  AppLayout,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Badge,
  Spinner,
  FormField,
  Input,
  Select,
  Modal,
  ConfirmDialog,
  IconPlus,
  IconEdit,
  IconTrash,
  CHART_COLORS,
  TRANSACTION_COLORS,
  useNotification,
} from '@aviary-ui/ui';
import { useTransactions, EMPTY_TRANSACTION } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { NAV_ITEMS } from '@/config/nav';

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
      dated: transaction.dated ? transaction.dated.split('T')[0] : EMPTY_TRANSACTION.dated,
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
    <AppLayout navItems={NAV_ITEMS} appName="Squirrel">
      {/* Page header */}
      <div className="page-header d-print-none mb-3">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="page-title">Transactions</h2>
          </div>
          <div className="col-auto ms-auto">
            <Button onClick={openAdd} className="d-flex align-items-center gap-2">
              <IconPlus size={16} />
              New Transaction
            </Button>
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
          <Card className="mb-3">
            <CardBody>
              <div className="row g-3 align-items-end">
                <div className="col-md-3 col-sm-6">
                  <label className="form-label">Category</label>
                  <Select
                    name="category_id"
                    value={filters.category_id}
                    onChange={handleFilterChange}
                  >
                    <option value="">All categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="col-md-3 col-sm-6">
                  <label className="form-label">Date Range</label>
                  <Select
                    name="dated"
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
                  </Select>
                </div>
                {filters.dated === 'custom' && (
                  <>
                    <div className="col-md-2 col-sm-6">
                      <label className="form-label">From</label>
                      <Input
                        type="date"
                        name="from"
                        value={filters.from}
                        onChange={handleFilterChange}
                      />
                    </div>
                    <div className="col-md-2 col-sm-6">
                      <label className="form-label">To</label>
                      <Input
                        type="date"
                        name="to"
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
            </CardBody>
          </Card>

          {/* Transactions table */}
          <Card>
            <CardBody noPadding>
              {isLoading ? (
                <Spinner centered />
              ) : error ? (
                <div className="p-4 text-center">
                  <p className="text-danger mb-3">{error}</p>
                  <Button variant="outline-danger" onClick={refetch}>
                    Retry
                  </Button>
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-5 text-center text-secondary">
                  <p className="mb-3">No transactions found.</p>
                  <Button onClick={openAdd}>Add first transaction</Button>
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
                          <Badge color={t.type === 'income' ? 'success' : 'danger'}>
                            {t.type}
                          </Badge>
                        </td>
                        <td className="text-secondary">
                          {new Date(t.dated).toLocaleDateString('en-GB')}
                        </td>
                        <td>
                          <div className="d-flex gap-2 justify-content-end">
                            <Button
                              variant="ghost-primary"
                              size="sm"
                              icon
                              onClick={() => openEdit(t)}
                              title="Edit"
                            >
                              <IconEdit size={16} />
                            </Button>
                            <Button
                              variant="ghost-danger"
                              size="sm"
                              icon
                              onClick={() => handleDeleteRequest(t)}
                              title="Delete"
                            >
                              <IconTrash size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardBody>
          </Card>
        </>
      )}

      {activeTab === 'charts' && transactions.length === 0 && !isLoading && (
        <Card>
          <CardBody className="p-5 text-center text-secondary">
            <p className="mb-3">No transactions to visualize.</p>
            <Button onClick={openAdd}>Add first transaction</Button>
          </CardBody>
        </Card>
      )}

      {activeTab === 'charts' && transactions.length > 0 && (
        <div className="row row-cards">
          {/* Pie: expense distribution */}
          <div className="col-lg-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution by Category</CardTitle>
              </CardHeader>
              <CardBody>
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
              </CardBody>
            </Card>
          </div>

          {/* Bar: top categories */}
          <div className="col-lg-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Categories by Spending</CardTitle>
              </CardHeader>
              <CardBody>
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
              </CardBody>
            </Card>
          </div>

          {/* Bar: top transactions */}
          <div className="col-12">
            <Card>
              <CardHeader>
                <CardTitle>Top Transactions by Amount</CardTitle>
              </CardHeader>
              <CardBody>
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
                          fill={entry.type === 'income' ? TRANSACTION_COLORS.income : TRANSACTION_COLORS.expense}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
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
          <FormField label="Category" htmlFor="category_id" error={formErrors.category_id}>
            <Select
              id="category_id"
              ref={firstInputRef}
              error={formErrors.category_id}
              value={formData.category_id}
              onChange={handleFormChange}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Amount" htmlFor="amount" error={formErrors.amount}>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              error={formErrors.amount}
              value={formData.amount}
              onChange={handleFormChange}
            />
          </FormField>
          <FormField label="Date" htmlFor="dated" error={formErrors.dated}>
            <Input
              id="dated"
              type="date"
              error={formErrors.dated}
              value={formData.dated}
              onChange={handleFormChange}
            />
          </FormField>
          <FormField label="Type" htmlFor="type">
            <Select id="type" value={formData.type} onChange={handleFormChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Select>
          </FormField>
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
            <Button variant="secondary" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">{isEditMode ? 'Update' : 'Save'}</Button>
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
