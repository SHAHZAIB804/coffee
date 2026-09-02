import React, { useState, useEffect } from 'react';

const AdminDashboardOverview = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    newOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('admin-token');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/admin/stats`, {
        headers: { 'x-admin-token': token }
      });
      if (res.ok) setStats(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const money = (val) => `$${Number(val).toFixed(2)}`;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Revenue</h3>
          <p className="text-3xl font-bold text-amber-600 mt-2">{money(stats.totalRevenue)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">New Orders</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.newOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pending Orders</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">{stats.pendingOrders}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Products</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active Products</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Categories</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.totalCategories}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
