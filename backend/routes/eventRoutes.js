const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', requireAuth, requireRole('organizer', 'admin'), async (req, res) => {
  try {
    const { title, description, date, time, venue, category, mainImage, thumbnailImage, status } = req.body;

    if (!title || !description || !date || !time || !venue || !category || !mainImage) {
      return res.status(400).json({
        message: 'Title, description, date, time, venue, category, and image are required',
      });
    }

    if (!['tech', 'cultural', 'sports'].includes(String(category).toLowerCase())) {
      return res.status(400).json({ message: 'Category must be tech, cultural, or sports' });
    }

    const duplicateEvent = await Event.findOne({
      title: title.trim(),
      date: new Date(date),
      venue: venue.trim(),
    });

    if (duplicateEvent) {
      return res.status(409).json({ message: 'An event with this title, date, and venue already exists' });
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      category,
      organizerId: req.user._id,
      organizerName: req.user.name,
      mainImage,
      thumbnailImage: thumbnailImage || mainImage,
      status: req.user.role === 'admin' ? (status || 'approved') : 'pending',
    });

    res.status(201).json(event);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An event with this title, date, and venue already exists' });
    }

    res.status(400).json({ message: error.message });
  }
});

router.get('/public', async (req, res) => {
  try {
    const filter = { status: 'approved' };
    
    if (req.query.category) filter.category = req.query.category;
    if (req.query.date) filter.date = new Date(req.query.date);

    const events = await Event.find(filter)
      .populate('organizerId', 'name email role')
      .sort({ date: 1, createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.user.role === 'admin') {
      // Admins see all
    } else if (req.user.role === 'organizer') {
      const userId = req.user._id.toString();
      filter.$or = [
        { status: 'approved' },
        { organizerId: userId }
      ];
    } else {
      filter.status = 'approved';
    }

    if (req.query.date) {
      filter.date = new Date(req.query.date);
    }

    if (req.query.organizerId) {
      filter.organizerId = req.query.organizerId;
    }

    const events = await Event.find(filter)
      .populate('organizerId', 'name email role')
      .sort({ date: 1, createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event id' });
    }

    const event = await Event.findById(req.params.id).populate('organizerId', 'name email role');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id', requireAuth, requireRole('organizer', 'admin'), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event id' });
    }

    const originalEvent = await Event.findById(req.params.id);
    if (!originalEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (String(originalEvent.organizerId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this event' });
    }

    const { title, description, date, time, venue, category, mainImage, thumbnailImage, status } = req.body;
    const updates = { title, description, date, time, venue, category, mainImage, thumbnailImage };
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    // Force pending if it was previously approved (CRITICAL RULE)
    if (originalEvent.status === 'approved' && req.user.role !== 'admin') {
      updates.status = 'pending';
    } else if (req.user.role === 'admin' && status) {
      updates.status = status;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', requireAuth, requireRole('organizer', 'admin'), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event id' });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (String(event.organizerId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/approve', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event id' });
    }

    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;