import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiList } from 'react-icons/fi';

const AdminSections = () => {
  const [sections, setSections] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'productList',
    enabled: true,
    order: 0,
    content: { description: '', productIds: [] }
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('admin-token');

  useEffect(() => {
    fetchSections();
    fetchProducts();

    const socket = io(apiUrl);
    socket.on('section:updated', () => fetchSections());

    return () => socket.disconnect();
  }, [apiUrl]);

  const fetchSections = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/sections?all=true`);
      if (res.ok) setSections(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/products`);
      if (res.ok) setProducts(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (sec = null) => {
    setError('');
    if (sec) {
      setEditingId(sec._id);
      setFormData({
        title: sec.title,
        type: sec.type,
        enabled: sec.enabled,
        order: sec.order,
        content: sec.content || { description: '', productIds: [] }
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        type: 'productList',
        enabled: true,
        order: sections.length,
        content: { description: '', productIds: [] }
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const url = editingId ? `${apiUrl}/api/sections/${editingId}` : `${apiUrl}/api/sections`;
      const method = editingId ? 'PUT' : 'POST';

      const data = new FormData();
      data.append('title', formData.title);
      data.append('type', formData.type);
      data.append('enabled', formData.enabled);
      data.append('order', formData.order);
      data.append('content', JSON.stringify(formData.content));

      const res = await fetch(url, {
        method,
        headers: { 'x-admin-token': token },
        body: data
      });

      if (!res.ok) throw new Error('Error saving section');
      
      setIsModalOpen(false);
      fetchSections();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to archive this section?')) return;
    try {
      const res = await fetch(`${apiUrl}/api/sections/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      if (res.ok) fetchSections();
      else alert('Failed to archive section');
    } catch (err) {
      alert('Error archiving section');
    }
  };

  const toggleProductSelection = (productId) => {
    const currentIds = formData.content.productIds || [];
    const newIds = currentIds.includes(productId) 
      ? currentIds.filter(id => id !== productId)
      : [...currentIds, productId];
      
    setFormData({
      ...formData,
      content: { ...formData.content, productIds: newIds }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dynamic Sections</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 flex items-center gap-2"
        >
          <FiPlus /> Add Section
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sections.map(sec => (
              <tr key={sec._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-500">{sec.order}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {sec.title}
                  <div className="text-xs text-gray-500 font-normal truncate max-w-xs">{sec.content?.description}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{sec.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sec.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {sec.enabled ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(sec)} className="text-indigo-600 hover:text-indigo-900 mr-4"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(sec._id)} className="text-red-600 hover:text-red-900"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {sections.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No sections found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Section' : 'Add Section'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title *</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-amber-500" />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows="2" value={formData.content?.description || ''} onChange={e => setFormData({...formData, content: {...formData.content, description: e.target.value}})} className="w-full border rounded-lg p-2 outline-none focus:border-amber-500"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} className="w-full border rounded-lg p-2 outline-none focus:border-amber-500" />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={formData.enabled} onChange={e => setFormData({...formData, enabled: e.target.checked})} className="rounded text-amber-600 focus:ring-amber-500 h-5 w-5" />
                    Active (Visible to customers)
                  </label>
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><FiList /> Assign Products</h3>
                <div className="max-h-48 overflow-y-auto border rounded-lg p-2 grid grid-cols-2 gap-2">
                  {products.filter(p=>!p.isDeleted).map(product => (
                    <label key={product._id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded border cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={(formData.content.productIds || []).includes(product._id)}
                        onChange={() => toggleProductSelection(product._id)}
                        className="rounded text-amber-600"
                      />
                      <span className="text-sm truncate" title={product.name}>{product.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-70">
                  {isSaving ? 'Saving...' : 'Save Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSections;

