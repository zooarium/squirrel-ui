import React, { useState, useRef, useEffect } from 'react';
import {
  AppLayout,
  Button,
  Card,
  CardBody,
  Badge,
  ResponsiveTable,
  FormField,
  Input,
  Modal,
  ConfirmDialog,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconX,
  useNotification,
} from '@aviary-ui/ui';
import { useCategories } from '@/hooks/useCategories';
import { NAV_ITEMS } from '@/config/nav';

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
    <AppLayout navItems={NAV_ITEMS} appName="Squirrel">
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
          <ResponsiveTable
            columns={[
              { key: 'id', header: 'ID', className: 'w-1 text-secondary' },
              { key: 'name', header: 'Name', mobile: 'primary', className: 'fw-medium' },
              {
                key: 'status',
                header: 'Status',
                render: (cat) => (
                  <Badge color={cat.status === 1 ? 'success' : 'secondary'}>
                    {cat.status === 1 ? 'Active' : 'Inactive'}
                  </Badge>
                ),
              },
              {
                key: 'actions',
                header: '',
                className: 'w-1',
                mobile: 'actions',
                render: (cat) => (
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
                ),
              },
            ]}
            data={categories}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
            emptyMessage="No categories found."
            emptyAction={<Button onClick={openAdd}>Add first category</Button>}
          />
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
      <Modal isOpen={isEditOpen} onClose={() => setEditOpen(false)} title="Edit Category" size="sm">
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
