import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    applicableProducts: [],
    isActive: true
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('admin-token');

  useEffect(() => {
    fetchOffers();
    fetchProducts();

    const socket = io(apiUrl);
    socket.on('offer:updated', () => fetchOffers());

    return () => socket.disconnect();
  }, [apiUrl]);

  const fetchOffers = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/offers?all=true`);
      if (res.ok) setOffers(await res.json());
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

  const handleOpenModal = (off = null) => {
    setError('');
    if (off) {
      setEditingId(off._id);
      setFormData({
        title: off.title,
        description: off.description || '',
        discountType: off.discountType,
        discountValue: off.discountValue,
        startDate: off.startDate ? new Date(off.startDate).toISOString().split('T')[0] : '',
        endDate: off.endDate ? new Date(off.endDate).toISOString().split('T')[0] : '',
        applicableProducts: off.applicableProducts.map(p => p._id || p),
        isActive: off.isActive
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        startDate: '',
        endDate: '',
        applicableProducts: [],
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const url = editingId ? `${apiUrl}/api/offers/${editingId}` : `${apiUrl}/api/offers`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'x-admin-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Error saving offer');
      
      setIsModalOpen(false);
      fetchOffers();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to archive this offer?')) return;
    try {
      const res = await fetch(`${apiUrl}/api/offers/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      if (res.ok) fetchOffers();
      else alert('Failed to delete offer');
    } catch (err) {
      alert('Error deleting offer');
    }
  };

  const toggleProduct = (pid) => {
    setFormData(prev => {
      const isSelected = prev.applicableProducts.includes(pid);
      if (isSelected) return { ...prev, applicableProducts: prev.applicableProducts.filter(id => id !== pid) };
      else return { ...prev, applicableProducts: [...prev.applicableProducts, pid] };
    });
  };

  const isExpired = (endDate) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Offers & Discounts</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 flex items-center gap-2"
        >
          <FiPlus /> Create Offer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {offers.map(off => (
              <tr key={off._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{off.title}</p>
                  <p className="text-xs text-gray-500">{off.description}</p>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-amber-600">
                  {off.discountType === 'percentage' ? `${off.discountValue}% OFF` : `$${off.discountValue} OFF`}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {off.startDate ? new Date(off.startDate).toLocaleDateString() : 'Always'} - 
                  {off.endDate ? new Date(off.endDate).toLocaleDateString() : 'Forever'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${off.isActive && !isExpired(off.endDate) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {off.isActive ? (isExpired(off.endDate) ? 'Expired' : 'Active') : 'Disabled'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(off)} className="text-indigo-600 hover:text-indigo-900 mr-4"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(off._id)} className="text-red-600 hover:text-red-900"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {offers.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No offers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Offer' : 'Create Offer'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title *</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-amber-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-amber-500">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
                  <input type="number" step="0.01" required value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-amber-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-amber-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-amber-500" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-amber-500"></textarea>
                </div>

                <div className="col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded text-amber-600 focus:ring-amber-500" />
                    Offer is Active
                  </label>
                </div>

                <div className="col-span-2 border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Products (Leave empty for all products)</label>
                  <div className="max-h-40 overflow-y-auto border rounded-lg p-2 grid grid-cols-2 gap-2">
                    {products.filter(p=>!p.isDeleted).map(product => (
                      <label key={product._id} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded border cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.applicableProducts.includes(product._id)}
                          onChange={() => toggleProduct(product._id)}
                          className="rounded text-amber-600"
                        />
                        <span className="text-sm truncate" title={product.name}>{product.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-70">
                  {isSaving ? 'Saving...' : 'Save Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOffers;

