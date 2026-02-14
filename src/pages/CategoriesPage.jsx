import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
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
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddNewCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
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
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setEditModalOpen(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !editingCategory) return;
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
      setCategories(
        categories.map((cat) => (cat.id === editingCategory.id ? result.data : cat))
      );
      setEditModalOpen(false);
      setEditingCategory(null);
      setNewCategoryName('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (window.confirm(`Are you sure you want to delete category "${category.name}" (ID: ${category.id})?`)) {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = `${import.meta.env.VITE_API_BE_URL}/categories/${category.id}`;
        const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status !== 204) throw new Error('Failed to delete category');
        setCategories(categories.filter((cat) => cat.id !== category.id));
      } catch (err) {
        setError(err.message);
      }
    }
  };


  if (isLoading) return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  if (error) return <div className="flex h-screen items-center justify-center bg-gray-900 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Categories</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white transition duration-300 ease-in-out hover:bg-green-700 focus:outline-none"
            title="Add New Category"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white transition duration-300 ease-in-out hover:bg-gray-600 focus:outline-none"
            title="Back to Dashboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold">Add New Category</h2>
            <form onSubmit={handleAddNewCategory}>
              <div className="mb-4">
                <label htmlFor="categoryName" className="mb-2 block text-sm font-bold">Category Name</label>
                <input id="categoryName" type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="w-full rounded border border-gray-600 bg-gray-700 px-4 py-3 leading-tight focus:border-green-500 focus:outline-none" placeholder="e.g., Electronics" required />
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setAddModalOpen(false)} className="rounded bg-gray-600 px-6 py-2 font-bold transition hover:bg-gray-500">Cancel</button>
                <button type="submit" className="rounded bg-green-600 px-6 py-2 font-bold transition hover:bg-green-500">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {isEditModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold">Edit Category</h2>
            <form onSubmit={handleUpdateCategory}>
              <div className="mb-4">
                <label htmlFor="editCategoryName" className="mb-2 block text-sm font-bold">Category Name</label>
                <input id="editCategoryName" type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="w-full rounded border border-gray-600 bg-gray-700 px-4 py-3 leading-tight focus:border-green-500 focus:outline-none" required />
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setEditModalOpen(false)} className="rounded bg-gray-600 px-6 py-2 font-bold transition hover:bg-gray-500">Cancel</button>
                <button type="submit" className="rounded bg-blue-600 px-6 py-2 font-bold transition hover:bg-blue-500">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg bg-gray-800 shadow-lg">
        <table className="min-w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-700">
                <td className="whitespace-nowrap px-6 py-4">{category.id}</td>
                <td className="whitespace-nowrap px-6 py-4">{category.name}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${category.status === 1 ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'}`}>
                    {category.status === 1 ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <button onClick={() => openEditModal(category)} className="text-blue-400 hover:text-blue-300" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button onClick={() => handleDeleteCategory(category)} className="ml-4 text-red-500 hover:text-red-400" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesPage;
