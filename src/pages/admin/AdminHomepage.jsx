import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const AdminHomepage = () => {
  const [heroData, setHeroData] = useState({
    heading: '',
    subheading: '',
    description: '',
    buttonText: '',
    buttonLink: ''
  });
  const [heroImage, setHeroImage] = useState(null);

  const [promoData, setPromoData] = useState({
    heading: '',
    description: '',
    discount: '',
    buttonText: '',
    isActive: true
  });
  const [promoImage, setPromoImage] = useState(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('admin-token');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/settings`);
      if (res.ok) {
        const data = await res.json();
        if (data.hero) setHeroData(data.hero);
        if (data.promo) setPromoData(data.promo);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveHero = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    try {
      const data = new FormData();
      data.append('value', JSON.stringify({...heroData, keepImage: true}));
      if (heroImage) data.append('image', heroImage);

      const res = await fetch(`${apiUrl}/api/settings/hero`, {
        method: 'POST',
        headers: { 'x-admin-token': token },
        body: data
      });
      if (res.ok) {
        setMessage('Hero section updated successfully!');
        setHeroImage(null);
        fetchSettings();
      } else throw new Error('Update failed');
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSavePromo = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    try {
      const data = new FormData();
      data.append('value', JSON.stringify({...promoData, keepImage: true}));
      if (promoImage) data.append('image', promoImage);

      const res = await fetch(`${apiUrl}/api/settings/promo`, {
        method: 'POST',
        headers: { 'x-admin-token': token },
        body: data
      });
      if (res.ok) {
        setMessage('Promo banner updated successfully!');
        setPromoImage(null);
        fetchSettings();
      } else throw new Error('Update failed');
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Homepage Management</h1>
      </div>
      
      {message && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
          {message}
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow mb-8 overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Hero Section</h2>
          <p className="text-gray-500 text-sm mt-1">Main banner displayed at the top of the homepage</p>
        </div>
        
        <form onSubmit={handleSaveHero} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
              <input type="text" value={heroData.heading} onChange={e => setHeroData({...heroData, heading: e.target.value})} className="w-full border rounded-lg p-2 focus:border-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
              <input type="text" value={heroData.subheading} onChange={e => setHeroData({...heroData, subheading: e.target.value})} className="w-full border rounded-lg p-2 focus:border-amber-500 outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows="2" value={heroData.description} onChange={e => setHeroData({...heroData, description: e.target.value})} className="w-full border rounded-lg p-2 focus:border-amber-500 outline-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input type="text" value={heroData.buttonText} onChange={e => setHeroData({...heroData, buttonText: e.target.value})} className="w-full border rounded-lg p-2 focus:border-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
              <input type="text" value={heroData.buttonLink} onChange={e => setHeroData({...heroData, buttonLink: e.target.value})} placeholder="/menu" className="w-full border rounded-lg p-2 focus:border-amber-500 outline-none" />
            </div>
            <div className="col-span-2 pt-2 border-t mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image</label>
              <div className="flex items-center gap-4">
                {heroData.imageUrl && !heroImage && (
                  <img src={`${apiUrl}${heroData.imageUrl}`} alt="Hero" className="h-16 w-16 object-cover rounded" />
                )}
                <input type="file" accept="image/*" onChange={e => setHeroImage(e.target.files[0])} className="border rounded-lg p-1.5 w-full text-sm" />
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={isSaving} className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-70">
              Save Hero
            </button>
          </div>
        </form>
      </div>

      {/* Promotional Banner */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Promotional Banner</h2>
            <p className="text-gray-500 text-sm mt-1">Mid-page promotional banner</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm font-medium text-gray-700">Active</span>
            <input 
              type="checkbox" 
              checked={promoData.isActive} 
              onChange={e => setPromoData({...promoData, isActive: e.target.checked})} 
              className="w-5 h-5 text-amber-600 rounded" 
            />
          </label>
        </div>
        
        <form onSubmit={handleSavePromo} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
              <input type="text" value={promoData.heading} onChange={e => setPromoData({...promoData, heading: e.target.value})} className="w-full border rounded-lg p-2 focus:border-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Text (e.g. 20% OFF)</label>
              <input type="text" value={promoData.discount} onChange={e => setPromoData({...promoData, discount: e.target.value})} className="w-full border rounded-lg p-2 focus:border-amber-500 outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows="2" value={promoData.description} onChange={e => setPromoData({...promoData, description: e.target.value})} className="w-full border rounded-lg p-2 focus:border-amber-500 outline-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input type="text" value={promoData.buttonText} onChange={e => setPromoData({...promoData, buttonText: e.target.value})} className="w-full border rounded-lg p-2 focus:border-amber-500 outline-none" />
            </div>
            <div className="col-span-2 pt-2 border-t mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Banner Background Image</label>
              <div className="flex items-center gap-4">
                {promoData.imageUrl && !promoImage && (
                  <img src={`${apiUrl}${promoData.imageUrl}`} alt="Promo" className="h-16 w-32 object-cover rounded" />
                )}
                <input type="file" accept="image/*" onChange={e => setPromoImage(e.target.files[0])} className="border rounded-lg p-1.5 w-full text-sm" />
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={isSaving} className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-70">
              Save Banner
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default AdminHomepage;

