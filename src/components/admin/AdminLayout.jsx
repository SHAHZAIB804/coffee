import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiBox, FiGrid, FiLayout, FiTag, FiSettings, FiLogOut } from 'react-icons/fi';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (!token) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: FiHome },
    { name: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
    { name: 'Products', path: '/admin/products', icon: FiBox },
    { name: 'Categories', path: '/admin/categories', icon: FiGrid },
    { name: 'Sections', path: '/admin/sections', icon: FiLayout },
    { name: 'Offers', path: '/admin/offers', icon: FiTag },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex fixed h-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-amber-500">CoffeeHub</h2>
          <p className="text-gray-400 text-xs mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/30 rounded-lg w-full transition-colors"
          >
            <FiLogOut size={20} />
            Logout
          </button>

        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
