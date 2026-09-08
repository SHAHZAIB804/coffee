import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('admin-token');

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/api/categories`);
      if (res.ok) setCategories(await res.json());
    } catch (err) {
      console.error('Network error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();

    const socket = io(API_URL);
    socket.on('category:created', fetchCategories);
    socket.on('category:updated', fetchCategories);
    socket.on('category:deleted', fetchCategories);

    return () => socket.disconnect();
  }, [fetchCategories]);

  const handleOpenModal = (cat = null) => {
    setError('');
    setSuccessMsg('');
    if (cat) {
      setEditingId(cat._id);
      setName(cat.name);
    } else {
      setEditingId(null);
      setName('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setError('');
    setSuccessMsg('');
    setName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const trimmed = name.trim();
    if (!trimmed) {
      setError('Category name cannot be empty.');
      return;
    }
    if (!token) {
      setError('Admin session expired. Please log in again.');
      return;
    }

    setIsSaving(true);
    try {
      const url = editingId
        ? `${API_URL}/api/categories/${editingId}`
        : `${API_URL}/api/categories`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'x-admin-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: trimmed }),
      });

      let responseBody = null;
      try { responseBody = await res.json(); } catch (_) {}

      if (!res.ok) {
        // Show the actual server error (e.g. "Category already exists")
        throw new Error(responseBody?.message || `Server error (HTTP ${res.status})`);
      }

      setSuccessMsg(`✅ Category "${responseBody.name}" ${editingId ? 'updated' : 'added'} successfully!`);
      await fetchCategories();

      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg('');
        setName('');
      }, 1500);

    } catch (err) {
      // Keep the modal open so the user can see the error and fix it
      setError(err.message || 'Could not save category. Please try again.');
      console.error('Save category error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Delete category "${catName}"? Products in this category will become uncategorized.`)) return;
    try {
      const res = await fetch(`${API_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token },
      });
      if (res.ok) {
        await fetchCategories();
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d.message || 'Failed to delete category.');
      }
    } catch (err) {
      alert('Network error: could not delete category.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Categories
          <span className="ml-3 text-base font-normal text-gray-400">({categories.length})</span>
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 flex items-center gap-2 transition"
        >
          <FiPlus /> Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden max-w-3xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-10 text-center text-gray-400">
                  No categories yet. Click <strong>Add Category</strong> to create one.
                </td>
              </tr>
            ) : categories.map(cat => (
              <tr key={cat._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {new Date(cat.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(cat)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 rounded hover:bg-indigo-50 transition"
                    title="Edit category"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id, cat.name)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                    title="Delete category"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Modal ─────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={handleCloseModal}
                disabled={isSaving}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <FiX size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Real error message from server */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex gap-2 items-start">
                  <span className="text-red-500 flex-shrink-0 mt-0.5">✕</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Success message */}
              {successMsg && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  {successMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => { setName(e.target.value); if (error) setError(''); }}
                  placeholder="e.g. Espresso, Cold Brew, Signature..."
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition font-semibold min-w-[90px]"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Saving...
                    </span>
                  ) : (editingId ? 'Update' : 'Add Category')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
