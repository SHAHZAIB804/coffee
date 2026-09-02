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
    const category = new Category({ name });
    await category.save();
    req.app.get('io').emit('category:created', category);
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE category (admin only)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (!category) return res.status(404).json({ message: 'Not found' });
    req.app.get('io').emit('category:updated', category);
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
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

