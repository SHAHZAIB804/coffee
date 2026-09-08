import express from 'express';
import Category from '../models/Category.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE category (admin only)
router.post('/', isAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required.' });
    }
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: `Category "${name.trim()}" already exists.` });
    }
    const category = new Category({ name: name.trim() });
    await category.save();
    req.app.get('io').emit('category:created', category);
    res.status(201).json(category);
  } catch (err) {
    console.error('Create category error:', err);
    res.status(400).json({ message: err.message || 'Could not create category.' });
  }
});

// UPDATE category (admin only)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required.' });
    }
    // Check for duplicate name (exclude self)
    const existing = await Category.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
    if (existing) {
      return res.status(400).json({ message: `Category "${name.trim()}" already exists.` });
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    req.app.get('io').emit('category:updated', category);
    res.json(category);
  } catch (err) {
    console.error('Update category error:', err);
    res.status(400).json({ message: err.message || 'Could not update category.' });
  }
});

// DELETE category (admin only) – hard delete for simplicity
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    req.app.get('io').emit('category:deleted', { _id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

