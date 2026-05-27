import React, { useState, useRef, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import {
  Button,
  Card,
  CardBody,
  Badge,
  Spinner,
  FormField,
  Input,
  Modal,
  ConfirmDialog,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconX,
} from '../ui';
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
            <Button onClick={openAdd} className="d-flex align-items-center gap-2">
              <IconPlus size={16} />
              New Category
            </Button>
          </div>
        </div>
      </div>

      {/* Search filter */}
      <Card className="mb-3">
        <CardBody>
          <div className="row">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <IconSearch size={16} />
                </span>
                <Input
                  type="text"
                  placeholder="Search by name…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                  >
                    <IconX size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Table card */}
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
          ) : categories.length === 0 ? (
            <div className="p-5 text-center text-secondary">
              <p className="mb-3">No categories found.</p>
              <Button onClick={openAdd}>Add first category</Button>
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
                      <Badge color={cat.status === 1 ? 'success' : 'secondary'}>
                        {cat.status === 1 ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          variant="ghost-primary"
                          size="sm"
                          icon
                          onClick={() => openEdit(cat)}
                          title="Edit"
                        >
                          <IconEdit size={16} />
                        </Button>
                        <Button
                          variant="ghost-danger"
                          size="sm"
                          icon
                          onClick={() => handleDeleteRequest(cat)}
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

      {/* Add modal */}
      <Modal isOpen={isAddOpen} onClose={() => setAddOpen(false)} title="Add Category" size="sm">
        <form onSubmit={handleAdd} noValidate>
          <FormField label="Category Name" htmlFor="addCategoryName" error={formError}>
            <Input
              id="addCategoryName"
              ref={addInputRef}
              type="text"
              error={formError}
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value);
                setFormError('');
              }}
              placeholder="e.g. Electronics"
            />
          </FormField>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
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
          <FormField label="Category Name" htmlFor="editCategoryName" error={formError}>
            <Input
              id="editCategoryName"
              ref={editInputRef}
              type="text"
              error={formError}
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value);
                setFormError('');
              }}
            />
          </FormField>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update</Button>
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
