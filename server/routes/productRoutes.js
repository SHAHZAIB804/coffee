import express from 'express';
import mongoose from 'mongoose';
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
    if (category) filter.category = category;
    const products = await Product.find(filter).populate('category', 'name').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Server error fetching products.' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID.' });
    }
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product || product.isDeleted) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// CREATE product (admin only) – expects multipart/form-data
router.post('/', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, category, description, price, discountPrice, isAvailable, isFeatured, stock } = req.body;

    // ── Validation ──────────────────────────────────────────────
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Product name is required.' });
    }
    if (!category) {
      return res.status(400).json({ message: 'Category is required.' });
    }
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category ID. Please select a valid category.' });
    }
    const parsedPrice = Number(price);
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: 'A valid price greater than 0 is required.' });
    }
    // Verify the category actually exists in the database
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'The selected category does not exist. Please add it first.' });
    }
    // ────────────────────────────────────────────────────────────

    const parsedDiscountPrice = discountPrice && !isNaN(Number(discountPrice)) ? Number(discountPrice) : undefined;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const product = new Product({
      name: name.trim(),
      category,
      description: description ? description.trim() : '',
      price: parsedPrice,
      discountPrice: parsedDiscountPrice,
      imageUrl,
      isAvailable: isAvailable !== 'false' && isAvailable !== false,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      stock: Number(stock) || 0,
    });

    await product.save();
    // Populate category for the response so frontend gets { name } immediately
    await product.populate('category', 'name');

    req.app.get('io').emit('product:created', product);
    console.log(`✅ Product created: "${product.name}" (ID: ${product._id})`);
    res.status(201).json(product);
  } catch (err) {
    console.error('Create product error:', err);
    // Provide a human-readable message
    let message = err.message || 'Could not create product.';
    if (err.name === 'ValidationError') {
      message = Object.values(err.errors).map(e => e.message).join('; ');
    }
    res.status(400).json({ message });
  }
});

// UPDATE product (admin only)
router.put('/:id', isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID.' });
    }

    const updates = {};
    const allowed = ['name', 'category', 'description', 'price', 'discountPrice', 'isAvailable', 'isFeatured', 'stock'];
    allowed.forEach(key => {
      if (req.body[key] !== undefined && req.body[key] !== '') {
        updates[key] = req.body[key];
      }
    });

    // Coerce types
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.discountPrice !== undefined) updates.discountPrice = Number(updates.discountPrice) || undefined;
    if (updates.stock !== undefined) updates.stock = Number(updates.stock) || 0;
    if (updates.isAvailable !== undefined) updates.isAvailable = updates.isAvailable !== 'false' && updates.isAvailable !== false;
    if (updates.isFeatured !== undefined) updates.isFeatured = updates.isFeatured === 'true' || updates.isFeatured === true;
    if (updates.name) updates.name = updates.name.trim();

    // Validate category if being updated
    if (updates.category) {
      if (!mongoose.Types.ObjectId.isValid(updates.category)) {
        return res.status(400).json({ message: 'Invalid category ID.' });
      }
      const catExists = await Category.findById(updates.category);
      if (!catExists) {
        return res.status(400).json({ message: 'Selected category does not exist.' });
      }
    }

    if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate('category', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    req.app.get('io').emit('product:updated', product);
    console.log(`✅ Product updated: "${product.name}" (ID: ${product._id})`);
    res.json(product);
  } catch (err) {
    console.error('Update product error:', err);
    let message = err.message || 'Could not update product.';
    if (err.name === 'ValidationError') {
      message = Object.values(err.errors).map(e => e.message).join('; ');
    }
    res.status(400).json({ message });
  }
});

// DELETE (soft delete) product (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID.' });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    req.app.get('io').emit('product:deleted', { _id: product._id });
    console.log(`🗑️ Product archived: "${product.name}" (ID: ${product._id})`);
    res.json({ message: 'Product archived successfully.' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Could not archive product.' });
  }
});

export default router;
