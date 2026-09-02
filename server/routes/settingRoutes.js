import express from 'express';
import Setting from '../models/Setting.js';
import { isAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// GET a setting by key
router.get('/:key', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) return res.status(404).json({ message: 'Not found' });
    res.json(setting.value);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET multiple settings
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find();
    const result = {};
    settings.forEach(s => result[s.key] = s.value);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE setting (with optional image upload)
router.post('/:key', isAdmin, upload.single('image'), async (req, res) => {
  try {
    let valueData = req.body.value ? JSON.parse(req.body.value) : req.body;
    if (req.file) {
      valueData.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    // If the setting already has an imageUrl and we didn't upload a new one, keep the old one (if passed in valueData)
    // Actually, to handle partial updates cleanly, we should fetch existing first:
    const existing = await Setting.findOne({ key: req.params.key });
    if (existing && existing.value && !req.file && valueData.keepImage) {
      valueData.imageUrl = existing.value.imageUrl;
    }
    
    const setting = await Setting.findOneAndUpdate(
      { key: req.params.key },
      { value: valueData },
      { new: true, upsert: true }
    );
    req.app.get('io').emit('setting:updated', setting);
    res.json(setting);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

export default router;

