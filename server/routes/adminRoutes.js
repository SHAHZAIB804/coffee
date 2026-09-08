import express from 'express';
import { isAdmin } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const router = express.Router();

// Get Dashboard Overview Stats
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      totalCategories,
      orders
    ] = await Promise.all([
      Product.countDocuments({ isDeleted: false }),
      Product.countDocuments({ isDeleted: false, isAvailable: true }),
      Category.countDocuments(),
      Order.find()
    ]);

    const newOrders = orders.filter(o => o.status === 'New').length;
    const pendingOrders = orders.filter(o => ['Confirmed', 'Preparing', 'Ready', 'Out for Delivery'].includes(o.status)).length;
    const completedOrders = orders.filter(o => o.status === 'Delivered').length;
    
    const totalRevenue = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.pricing?.total || 0), 0);

    res.json({
      totalProducts,
      activeProducts,
      totalCategories,
      totalOrders: orders.length,
      newOrders,
      pendingOrders,
      completedOrders,
      totalRevenue
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Aggregated Customers from Orders
router.get('/customers', isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const customersMap = {};

    orders.forEach(order => {
      const phone = order.customer?.phone;
      if (!phone) return;

      if (!customersMap[phone]) {
        customersMap[phone] = {
          name: order.customer.name,
          phone: order.customer.phone,
          email: order.customer.email,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.createdAt,
          status: 'Active'
        };
      }
      
      customersMap[phone].totalOrders += 1;
      if (order.status !== 'Cancelled') {
         customersMap[phone].totalSpent += (order.pricing?.total || 0);
      }
      
      // Update last order date if this order is newer
      if (new Date(order.createdAt) > new Date(customersMap[phone].lastOrderDate)) {
         customersMap[phone].lastOrderDate = order.createdAt;
         // Also update name/email to latest
         customersMap[phone].name = order.customer.name;
         customersMap[phone].email = order.customer.email;
      }
    });

    res.json(Object.values(customersMap));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

