const express = require('express');
const mongoose = require('mongoose');
const RSVP = require('../models/RSVP');
const Event = require('../models/Event');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', requireAuth, requireRole('student'), async (req, res) => {
  try {
    const { eventId } = req.body;
    const status = req.body.status || 'attending';
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: 'Invalid user or event id' });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const existingRsvp = await RSVP.findOne({ userId, eventId });

    if (!existingRsvp) {
      const rsvp = await RSVP.create({ userId, eventId, status });

      if (status === 'attending') {
        await Event.findByIdAndUpdate(eventId, { $inc: { rsvpCount: 1 } });
      }

      return res.status(201).json(rsvp);
    }

    if (existingRsvp.status === 'attending') {
      return res.status(409).json({ message: 'You have already RSVPd for this event' });
    }

    existingRsvp.status = 'attending';
    await existingRsvp.save();
    await Event.findByIdAndUpdate(eventId, { $inc: { rsvpCount: 1 } });

    return res.json(existingRsvp);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'You have already RSVPd for this event' });
    }

    return res.status(400).json({ message: error.message });
  }
});

router.patch('/:eventId/cancel', requireAuth, requireRole('student'), async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: 'Invalid event id' });
    }

    const rsvp = await RSVP.findOne({ userId, eventId });

    if (!rsvp || rsvp.status !== 'attending') {
      return res.status(404).json({ message: 'No active RSVP found for this event' });
    }

    rsvp.status = 'cancelled';
    await rsvp.save();
    await Event.findByIdAndUpdate(eventId, { $inc: { rsvpCount: -1 } });

    return res.json({ message: 'RSVP cancelled successfully', rsvp });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get('/event/:eventId', requireAuth, async (req, res) => {
  try {
    const rsvps = await RSVP.find({ eventId: req.params.eventId }).populate('userId', 'name email role');
    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user/:userId', requireAuth, async (req, res) => {
  try {
    if (String(req.user._id) !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied for this RSVP list' });
    }

    const rsvps = await RSVP.find({ userId: req.params.userId, status: 'attending' }).populate('eventId');
    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;