import express from 'express';
import Offer from '../models/Offer.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all offers (public for active ones, admin for all)
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    const filter = { isDeleted: false };
    if (all !== 'true') {
      filter.isActive = true;
      const now = new Date();
      filter.$or = [
        { endDate: { $exists: false } },
        { endDate: null },
        { endDate: { $gt: now } }
      ];
    }
    const offers = await Offer.find(filter).populate('applicableProducts');
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// CREATE offer
router.post('/', isAdmin, async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    req.app.get('io').emit('offer:updated');
    res.status(201).json(offer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE offer
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) return res.status(404).json({ message: 'Not found' });
    req.app.get('io').emit('offer:updated');
    res.json(offer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE (soft) offer
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await Offer.findByIdAndUpdate(req.params.id, { isDeleted: true });
    req.app.get('io').emit('offer:updated');
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

