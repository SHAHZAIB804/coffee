import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Create an audio element for the notification sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audioRef.current = audio;

    fetchOrders();

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    
    socket.on('NEW_ORDER', (order) => {
      setOrders((prev) => [order, ...prev]);
      playNotificationSound();
      if (voiceEnabled) {
        announceOrder(order);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [voiceEnabled]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed', e));
    }
  };

  const announceOrder = (order) => {
    if ('speechSynthesis' in window) {
      const text = `New CoffeeHub order received. Order number ${order.orderId}. Customer ${order.customer.name}. Delivery address ${order.customer.city}. Total amount ${order.pricing.total} rupees. Payment method ${order.paymentMethod}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
        // Voice announcement when order is confirmed
        if (status === 'Confirmed') {
          const confirmedOrder = orders.find(o => o._id === id);
          if (confirmedOrder && 'speechSynthesis' in window) {
            const text = `Order ${confirmedOrder.orderId} has been confirmed. Customer ${confirmedOrder.customer.name}, total ${confirmedOrder.pricing.total} rupees.`;
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
          }
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const money = (value) => `$${Number(value).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          {!voiceEnabled && (
            <button 
              onClick={() => setVoiceEnabled(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
            >
              Enable Voice Notifications
            </button>
          )}
          {voiceEnabled && (
            <span className="text-green-600 font-semibold flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              Voice Notifications Active
            </span>
          )}
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID & Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items & Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <motion.tr 
                  key={order._id}
                  initial={{ opacity: 0, backgroundColor: '#fef3c7' }}
                  animate={{ opacity: 1, backgroundColor: '#ffffff' }}
                  transition={{ duration: 1 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{order.orderId}</div>
                    <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                    <div className="text-sm text-gray-500">{order.customer.phone}</div>
                    <div className="text-sm text-gray-500">{order.customer.address}, {order.customer.city}</div>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="text-sm text-gray-500 mb-2">
                      {order.items.map(item => (
                        <li key={item.id}>{item.quantity}x {item.name}</li>
                      ))}
                    </ul>
                    <div className="text-sm font-bold text-gray-900">{money(order.pricing.total)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
                    >
                      {['New', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

