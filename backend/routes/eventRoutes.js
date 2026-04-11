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
      status: status || 'upcoming',
    });

    res.status(201).json(event);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An event with this title, date, and venue already exists' });
    }

    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.status) {
      filter.status = req.query.status;
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

router.patch('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event id' });
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event id' });
    }

    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;