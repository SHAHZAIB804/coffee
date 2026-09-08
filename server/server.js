import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Order from './models/Order.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import sectionRoutes from './routes/sectionRoutes.js';
import adminDataRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

app.use(cors());
app.use(express.json());

// Make io accessible in routes
app.set('io', io);

// Serve uploaded images (public/uploads)
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Register API routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/admin', adminDataRoutes);



app.post('/api/admin/verify', (req, res) => {
  const { token } = req.body;
  const adminToken = process.env.ADMIN_TOKEN || 'admin123';
  if (token === adminToken) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin token' });
  }
});

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/coffeehub';

    // Check if we need to use memory server (e.g., if local Mongo is not running)
    if (mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost')) {
      try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        console.log('MongoDB connected to local instance at', mongoUri);
        return;
      } catch (err) {
        console.log('Local MongoDB not found, starting memory server for testing...');
        const mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        console.log('MongoDB memory server URI:', mongoUri);
      }
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected (Memory Server or Atlas) using', mongoUri);
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

connectDB();

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const newOrder = new Order(orderData);
    await newOrder.save();
    
    io.emit('NEW_ORDER', newOrder);
    
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

io.on('connection', (socket) => {
  console.log('Admin dashboard connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Admin dashboard disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
