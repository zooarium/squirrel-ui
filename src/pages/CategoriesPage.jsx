import React, { useState, useRef, useEffect } from 'react';
import { IconPlus, IconEdit, IconTrash, IconSearch, IconX } from '@tabler/icons-react';
import AppLayout from '../components/AppLayout';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useCategories } from '../hooks/useCategories';
import { useNotification } from '../context/NotificationContext';

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterName, setFilterName] = useState('');
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formName, setFormName] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });

  const addInputRef = useRef(null);
  const editInputRef = useRef(null);
  const { showNotification } = useNotification();
  const { categories, isLoading, error, create, update, remove, refetch } = useCategories({
    name: filterName,
  });

  // Debounce search → filter
  useEffect(() => {
    const timer = setTimeout(() => setFilterName(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (isAddOpen) addInputRef.current?.focus();
  }, [isAddOpen]);

  useEffect(() => {
    if (isEditOpen) editInputRef.current?.focus();
  }, [isEditOpen]);

  const openAdd = () => {
    setFormName('');
    setFormError('');
    setAddOpen(true);
  };

  const openEdit = (category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormError('');
    setEditOpen(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Category name is required.');
      return;
    }
    try {
      await create(formName.trim());
      setAddOpen(false);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Category name is required.');
      return;
    }
    try {
      await update(editingCategory.id, formName.trim(), editingCategory.status);
      setEditOpen(false);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteRequest = (category) => {
    setConfirmState({
      isOpen: true,
      message: `Delete category "${category.name}"? This cannot be undone.`,
      onConfirm: async () => {
        try {
          await remove(category.id);
        } catch (err) {
          showNotification(err.message, 'error');
        } finally {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  return (
    <AppLayout>
      {/* Page header */}
      <div className="page-header d-print-none mb-3">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="page-title">Categories</h2>
          </div>
          <div className="col-auto ms-auto">
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={openAdd}
            >
              <IconPlus size={16} />
              New Category
            </button>
          </div>
        </div>
      </div>

      {/* Search filter */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <IconSearch size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                  >
                    <IconX size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table card */}
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
          ) : categories.length === 0 ? (
            <div className="p-5 text-center text-secondary">
              <p className="mb-3">No categories found.</p>
              <button className="btn btn-primary" onClick={openAdd}>
                Add first category
              </button>
            </div>
          ) : (
            <table className="table table-vcenter table-hover card-table">
              <thead>
                <tr>
                  <th className="w-1">ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th className="w-1" />
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td className="text-secondary">{cat.id}</td>
                    <td className="fw-medium">{cat.name}</td>
                    <td>
                      <span
                        className={`badge ${cat.status === 1 ? 'bg-success-lt' : 'bg-secondary-lt'}`}
                      >
                        {cat.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-end">
                        <button
                          className="btn btn-sm btn-ghost-primary btn-icon"
                          onClick={() => openEdit(cat)}
                          title="Edit"
                        >
                          <IconEdit size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-ghost-danger btn-icon"
                          onClick={() => handleDeleteRequest(cat)}
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

      {/* Add modal */}
      <Modal isOpen={isAddOpen} onClose={() => setAddOpen(false)} title="Add Category" size="sm">
        <form onSubmit={handleAdd} noValidate>
          <div className="mb-3">
            <label className="form-label" htmlFor="addCategoryName">
              Category Name
            </label>
            <input
              id="addCategoryName"
              ref={addInputRef}
              type="text"
              className={`form-control ${formError ? 'is-invalid' : ''}`}
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value);
                setFormError('');
              }}
              placeholder="e.g. Electronics"
            />
            {formError && <div className="invalid-feedback">{formError}</div>}
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setAddOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Category"
        size="sm"
      >
        <form onSubmit={handleEdit} noValidate>
          <div className="mb-3">
            <label className="form-label" htmlFor="editCategoryName">
              Category Name
            </label>
            <input
              id="editCategoryName"
              ref={editInputRef}
              type="text"
              className={`form-control ${formError ? 'is-invalid' : ''}`}
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value);
                setFormError('');
              }}
            />
            {formError && <div className="invalid-feedback">{formError}</div>}
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setEditOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update
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
