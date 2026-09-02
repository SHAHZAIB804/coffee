import express from 'express';
import Section from '../models/Section.js';
import { isAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// GET all active sections (public)
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    const filter = { isDeleted: false };
    if (all !== 'true') filter.enabled = true;
    
    const sections = await Section.find(filter).sort({ order: 1 });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE section
router.post('/', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.content) data.content = JSON.parse(data.content);
    if (req.file) {
      data.content = data.content || {};
      data.content.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const section = new Section(data);
    await section.save();
    req.app.get('io').emit('section:updated');
    res.status(201).json(section);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE section
router.put('/:id', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.content) data.content = JSON.parse(data.content);
    
    if (req.file) {
      data.content = data.content || {};
      data.content.imageUrl = `/uploads/${req.file.filename}`;
    } else if (data.content && data.content.keepImage) {
       const existing = await Section.findById(req.params.id);
       if(existing && existing.content && existing.content.imageUrl) {
           data.content.imageUrl = existing.content.imageUrl;
       }
    }

    const section = await Section.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!section) return res.status(404).json({ message: 'Not found' });
    req.app.get('io').emit('section:updated');
    res.json(section);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE (soft) section
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await Section.findByIdAndUpdate(req.params.id, { isDeleted: true });
    req.app.get('io').emit('section:updated');
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

