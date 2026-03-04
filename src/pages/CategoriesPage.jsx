import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import ConfirmDialog from '../components/ConfirmDialog';
import MatrixRain from '../components/MatrixRain';
import Header from '../components/Header';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });
  const [formErrors, setFormErrors] = useState({});
  const [filters, setFilters] = useState({
    name: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const addInputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isAddModalOpen && addInputRef.current) {
      addInputRef.current.focus();
    }
  }, [isAddModalOpen]);

  useEffect(() => {
    if (isEditModalOpen && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditModalOpen]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      if (filters.name) queryParams.append('name', filters.name);

      const apiUrl = `${import.meta.env.VITE_API_BE_URL}/categories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      // Handle both { data: [...] } and { data: { categories: [...] } }
      const categoriesData = data.data?.categories || (Array.isArray(data.data) ? data.data : []);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters((prev) => ({ ...prev, name: searchTerm }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleFilterChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddNewCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setFormErrors({ name: 'Category name is required.' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const apiUrl = `${import.meta.env.VITE_API_BE_URL}/categories`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName, status: 1 }),
      });
      if (!response.ok) throw new Error('Failed to add category');
      const result = await response.json();
      setCategories([...categories, result.data]);
      setNewCategoryName('');
      setAddModalOpen(false);
      showNotification('Category added successfully!', 'success');
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
    }
  };

  const handleNameChange = (e) => {
    setNewCategoryName(e.target.value);
    if (formErrors.name) {
      setFormErrors({ ...formErrors, name: null });
    }
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setFormErrors({});
    setEditModalOpen(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setFormErrors({ name: 'Category name is required.' });
      return;
    }
    if (!editingCategory) return;

    try {
      const token = localStorage.getItem('token');
      const apiUrl = `${import.meta.env.VITE_API_BE_URL}/categories/${editingCategory.id}`;
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName, status: editingCategory.status }),
      });
      if (!response.ok) throw new Error('Failed to update category');
      const result = await response.json();
      setCategories(categories.map((cat) => (cat.id === editingCategory.id ? result.data : cat)));
      setEditModalOpen(false);
      setEditingCategory(null);
      setNewCategoryName('');
      showNotification('Category updated successfully!', 'success');
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteRequest = (category) => {
    setConfirmState({
      isOpen: true,
      message: `Are you sure you want to delete category "${category.name}" (ID: ${category.id})?`,
      onConfirm: () => handleDeleteCategory(category),
    });
  };

  const handleDeleteCategory = async (category) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = `${import.meta.env.VITE_API_BE_URL}/categories/${category.id}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status !== 204) throw new Error('Failed to delete category');
      setCategories(categories.filter((cat) => cat.id !== category.id));
      showNotification('Category deleted successfully!', 'success');
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
    } finally {
      setConfirmState({ isOpen: false, message: '', onConfirm: () => {} });
    }
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
          <h1 className="text-shadow-glow text-4xl font-bold">Categories</h1>
          <button
            onClick={() => {
              setAddModalOpen(true);
              setFormErrors({});
            }}
            className="transform rounded-full bg-green-700 p-3 font-bold text-black transition duration-300 ease-in-out hover:scale-110 hover:bg-green-600 focus:shadow-[0_0_15px_rgba(34,197,94,0.6)] focus:outline-none"
            aria-label="New Category"
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

        <div className="mb-6 rounded-lg border border-green-600 bg-black/80 p-4 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="filter-name" className="mb-2 block text-xs font-bold uppercase">
                Search Name
              </label>
              <div className="relative">
                <input
                  id="filter-name"
                  name="name"
                  type="text"
                  value={searchTerm}
                  onChange={handleFilterChange}
                  placeholder="Filter by name..."
                  className="w-full rounded border border-green-600 bg-black pl-3 pr-10 py-2 text-green-300 focus:border-green-400 focus:outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-400"
                    aria-label="Clear search"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                )}
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-lg">Loading...</div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center space-y-4 rounded-lg border border-red-500 bg-red-900/20 p-8 text-red-500">
            <p className="text-xl font-bold">Error: {error}</p>
            <button
              onClick={fetchCategories}
              className="rounded bg-red-700 px-4 py-2 font-bold text-white hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center space-y-4 rounded-lg border border-green-600 bg-green-900/10 p-8 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <p className="text-xl">No categories found.</p>
            <button
              onClick={() => {
                setAddModalOpen(true);
                setFormErrors({});
              }}
              className="rounded border border-green-600 bg-black px-4 py-2 hover:bg-green-900/20"
            >
              Add your first category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-green-600 bg-black/80 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <table className="min-w-full">
              <thead className="border-b border-green-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
                            <tbody className="divide-y divide-green-800">
                              {Array.isArray(categories) && categories.map((category) => (
                                <tr key={category.id} className="hover:bg-green-900/20">                    <td className="px-6 py-4 whitespace-nowrap">{category.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${category.status === 1 ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'}`}
                      >
                        {category.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(category)}
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
                        onClick={() => handleDeleteRequest(category)}
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
        )}

        {isAddModalOpen && (
          <div
            className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black"
            onClick={() => setAddModalOpen(false)}
          >
            <div
              className="relative w-full max-w-md rounded-lg border border-green-600 bg-black/80 p-8 shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setAddModalOpen(false)}
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
              <h2 className="text-shadow-glow mb-6 text-2xl font-bold">Add New Category</h2>
              <form onSubmit={handleAddNewCategory} noValidate>
                <div className="mb-4">
                  <label htmlFor="categoryName" className="mb-2 block text-sm font-bold">
                    Category Name
                  </label>
                  <input
                    id="categoryName"
                    ref={addInputRef}
                    type="text"
                    value={newCategoryName}
                    onChange={handleNameChange}
                    className={`w-full appearance-none rounded border bg-black px-4 py-3 leading-tight text-green-300 shadow transition-shadow duration-300 focus:outline-none ${formErrors.name ? 'border-red-500 focus:border-red-500' : 'border-green-600 focus:border-green-400'}`}
                    placeholder="e.g., Electronics"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="submit"
                    className="transform rounded bg-green-700 px-6 py-2 font-bold tracking-wider text-black uppercase transition duration-300 ease-in-out hover:bg-green-600 focus:shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditModalOpen && editingCategory && (
          <div
            className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black"
            onClick={() => setEditModalOpen(false)}
          >
            <div
              className="relative w-full max-w-md rounded-lg border border-green-600 bg-black/80 p-8 shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setEditModalOpen(false)}
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
              <h2 className="text-shadow-glow mb-6 text-2xl font-bold">Edit Category</h2>
              <form onSubmit={handleUpdateCategory} noValidate>
                <div className="mb-4">
                  <label htmlFor="editCategoryName" className="mb-2 block text-sm font-bold">
                    Category Name
                  </label>
                  <input
                    id="editCategoryName"
                    ref={editInputRef}
                    type="text"
                    value={newCategoryName}
                    onChange={handleNameChange}
                    className={`w-full appearance-none rounded border bg-black px-4 py-3 leading-tight text-green-300 shadow transition-shadow duration-300 focus:outline-none ${formErrors.name ? 'border-red-500 focus:border-red-500' : 'border-green-600 focus:border-green-400'}`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="submit"
                    className="transform rounded bg-blue-700 px-6 py-2 font-bold tracking-wider text-white uppercase transition duration-300 ease-in-out hover:bg-blue-600 focus:shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
