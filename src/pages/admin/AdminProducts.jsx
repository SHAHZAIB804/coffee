import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiImage } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const emptyForm = {
  name: '',
  category: '',
  description: '',
  price: '',
  discountPrice: '',
  stock: '',
  isAvailable: true,
  isFeatured: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [listLoading, setListLoading] = useState(true);

  const token = localStorage.getItem('admin-token');

  // ── Fetchers ─────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    try {
      setListLoading(true);
      const res = await fetch(`${API_URL}/api/products`);
      if (res.ok) {
        setProducts(await res.json());
      } else {
        console.error('Failed to fetch products:', res.status);
      }
    } catch (err) {
      console.error('Network error fetching products:', err);
    } finally {
      setListLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      if (res.ok) setCategories(await res.json());
    } catch (err) {
      console.error('Network error fetching categories:', err);
    }
  }, []);

  // ── Real-time socket ─────────────────────────────────────────────────
  useEffect(() => {
    fetchProducts();
    fetchCategories();

    const socket = io(API_URL);
    socket.on('product:created', fetchProducts);
    socket.on('product:updated', fetchProducts);
    socket.on('product:deleted', fetchProducts);
    socket.on('category:created', fetchCategories);
    socket.on('category:updated', fetchCategories);
    socket.on('category:deleted', fetchCategories);

    return () => socket.disconnect();
  }, [fetchProducts, fetchCategories]);

  // ── Modal helpers ────────────────────────────────────────────────────
  const handleOpenModal = (product = null) => {
    setError('');
    setSuccessMsg('');
    setImageFile(null);
    setImagePreview(null);

    if (product) {
      setEditingId(product._id);
      setExistingImageUrl(product.imageUrl ? `${API_URL}${product.imageUrl}` : null);
      setFormData({
        name: product.name || '',
        category: product.category?._id || '',
        description: product.description || '',
        price: product.price ?? '',
        discountPrice: product.discountPrice ?? '',
        stock: product.stock ?? '',
        isAvailable: product.isAvailable ?? true,
        isFeatured: product.isFeatured ?? false,
      });
    } else {
      setEditingId(null);
      setExistingImageUrl(null);
      const defaultCat = categories.length > 0 ? categories[0]._id : '';
      setFormData({ ...emptyForm, category: defaultCat });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return; // Don't close while saving
    setIsModalOpen(false);
    setError('');
    setSuccessMsg('');
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) { setImageFile(null); setImagePreview(null); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error as user corrects the form
  };

  // ── Submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // ── Client-side validation ────────────────────────────────────────
    if (!formData.name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!formData.category) {
      setError('Please select a category. If none exist, create one in the Categories section first.');
      return;
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setError('Please enter a valid price greater than 0.');
      return;
    }
    if (!token) {
      setError('Your admin session has expired. Please log in again.');
      return;
    }
    // ─────────────────────────────────────────────────────────────────

    setIsSaving(true);

    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('category', formData.category);
      data.append('description', formData.description.trim());
      data.append('price', String(Number(formData.price)));
      if (formData.discountPrice && !isNaN(Number(formData.discountPrice))) {
        data.append('discountPrice', String(Number(formData.discountPrice)));
      }
      data.append('stock', String(Number(formData.stock) || 0));
      data.append('isAvailable', String(formData.isAvailable));
      data.append('isFeatured', String(formData.isFeatured));
      if (imageFile) data.append('image', imageFile);

      const url = editingId ? `${API_URL}/api/products/${editingId}` : `${API_URL}/api/products`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'x-admin-token': token },
        body: data,
      });

      // Parse the response body regardless of status
      let responseBody = null;
      try { responseBody = await res.json(); } catch (_) {}

      if (!res.ok) {
        // Server returned an error — show the real message, keep form open
        throw new Error(
          responseBody?.message || `Server error (HTTP ${res.status}). Please try again.`
        );
      }

      if (!responseBody || !responseBody._id) {
        throw new Error('Product was not saved correctly — server response was empty.');
      }

      // ✅ Real success confirmed by server
      setSuccessMsg(`✅ Product "${responseBody.name}" ${editingId ? 'updated' : 'added'} successfully!`);
      await fetchProducts(); // Refresh the list

      // Close modal after short delay so user sees the success message
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg('');
        setImageFile(null);
        setImagePreview(null);
        setExistingImageUrl(null);
      }, 1800);

    } catch (err) {
      // ❌ Show the real error, keep the form open so user can fix and retry
      setError(err.message || 'An unexpected error occurred. Please check the browser console.');
      console.error('Save product error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Archive ───────────────────────────────────────────────────────────
  const handleArchive = async (id, name) => {
    if (!window.confirm(`Archive "${name}"? It will no longer be visible to customers.`)) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token },
      });
      if (res.ok) {
        await fetchProducts();
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d.message || 'Failed to archive product.');
      }
    } catch (err) {
      alert('Network error: could not archive product.');
    }
  };

  // ── Filtering ────────────────────────────────────────────────────────
  const filtered = products.filter(p => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || p.category?._id === filterCat;
    return matchName && matchCat;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Products
          <span className="ml-3 text-base font-normal text-gray-400">({products.length} total)</span>
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 flex items-center gap-2 transition"
        >
          <FiPlus /> Add Product
        </button>
      </div>

      {/* No categories warning */}
      {categories.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          ⚠️ No categories found. Go to <strong>Categories</strong> in the sidebar and add at least one category before creating products.
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow mb-6 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          />
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="border rounded-lg px-3 py-2 outline-none focus:border-amber-500 text-sm"
        >
          <option value="">All categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      {/* Product table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {listLoading ? (
              <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400">Loading products...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                {products.length === 0 ? 'No products yet. Click "Add Product" to create your first one.' : 'No products match your search.'}
              </td></tr>
            ) : filtered.map(product => (
              <tr key={product._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {product.imageUrl ? (
                      <img src={`${API_URL}${product.imageUrl}`} alt={product.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0 border" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 flex-shrink-0 border">
                        <FiImage size={18} />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      {product.isFeatured && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Featured</span>}
                      {product.discountPrice && (
                        <span className="ml-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          Sale: ${product.discountPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.category?.name || <span className="text-red-400">No category</span>}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">${Number(product.price).toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.isAvailable ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 p-1 rounded hover:bg-indigo-50 transition"
                    title="Edit product"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleArchive(product._id, product.name)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition"
                    title="Archive product"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Add / Edit Modal ───────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
            {/* Modal header */}
            <div className="flex justify-between items-center px-6 py-4 border-b flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={handleCloseModal}
                disabled={isSaving}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <FiX size={22} />
              </button>
            </div>

            {/* Modal body — scrollable */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
              <div className="p-6 space-y-5">

                {/* Error banner — real error from server */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex gap-2 items-start">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">✕</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Success banner */}
                {successMsg && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    {successMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Product Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => handleFieldChange('name', e.target.value)}
                      placeholder="e.g. Iced Caramel Latte"
                      className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    {categories.length === 0 ? (
                      <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-xs">
                        No categories yet. Please add one in the <strong>Categories</strong> section first.
                      </div>
                    ) : (
                      <select
                        required
                        value={formData.category}
                        onChange={e => handleFieldChange('category', e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="">— Select a category —</option>
                        {categories.map(c => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={e => handleFieldChange('stock', e.target.value)}
                      placeholder="0"
                      className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={formData.price}
                      onChange={e => handleFieldChange('price', e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  {/* Discount Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Price <span className="text-gray-400 text-xs font-normal">(optional)</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.discountPrice}
                      onChange={e => handleFieldChange('discountPrice', e.target.value)}
                      placeholder="Leave blank for no discount"
                      className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={e => handleFieldChange('description', e.target.value)}
                      placeholder="Brief description of this product..."
                      className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                    />
                  </div>

                  {/* Image */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Image <span className="text-gray-400 text-xs font-normal">(optional, max 5MB)</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border rounded-lg px-3 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    />
                    {/* Preview */}
                    {(imagePreview || existingImageUrl) && (
                      <div className="mt-2 flex items-center gap-3">
                        <img
                          src={imagePreview || existingImageUrl}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <span className="text-xs text-gray-500">
                          {imagePreview ? 'New image selected' : 'Current image (upload a new file to replace)'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Toggles */}
                  <div className="sm:col-span-2 flex flex-wrap gap-6 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.isAvailable}
                        onChange={e => handleFieldChange('isAvailable', e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Available to customers</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={e => handleFieldChange('isFeatured', e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured on homepage</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center gap-3 flex-shrink-0 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...emptyForm, category: formData.category });
                    setImageFile(null);
                    setImagePreview(null);
                    setError('');
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  Reset
                </button>
                <div className="flex gap-3">
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
                    disabled={isSaving || categories.length === 0}
                    className="px-5 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition font-semibold min-w-[110px]"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2 justify-center">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Saving...
                      </span>
                    ) : (editingId ? 'Update Product' : 'Add Product')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
