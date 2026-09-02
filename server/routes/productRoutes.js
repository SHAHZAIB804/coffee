import express from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { isAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// GET all products with optional query params: search, category, available, sort
router.get('/', async (req, res) => {
  try {
    const { search, category, available } = req.query;
    const filter = { isDeleted: false };
    if (available !== undefined) filter.isAvailable = available === 'true';
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category; // expecting category id
    const products = await Product.find(filter).populate('category', 'name');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product || product.isDeleted) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE product (admin only) – expects multipart/form-data for image
router.post('/', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, category, description, price, discountPrice, isAvailable, isFeatured, stock } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const product = new Product({
      name,
      category,
      description,
      price,
      discountPrice,
      imageUrl,
      isAvailable: isAvailable !== 'false',
      isFeatured: isFeatured === 'true',
      stock: Number(stock) || 0,
    });
    await product.save();
    // emit realtime event
    req.app.get('io').emit('product:created', product);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE product (admin only)
router.put('/:id', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;
    if (updates.isAvailable !== undefined) updates.isAvailable = updates.isAvailable !== 'false';
    if (updates.isFeatured !== undefined) updates.isFeatured = updates.isFeatured === 'true';
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) return res.status(404).json({ message: 'Not found' });
    req.app.get('io').emit('product:updated', product);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE (soft delete) product (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!product) return res.status(404).json({ message: 'Not found' });
    req.app.get('io').emit('product:deleted', { _id: product._id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

