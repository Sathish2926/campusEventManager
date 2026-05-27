const express = require('express');
const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const Event = require('../models/Event');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', requireAuth, requireRole('organizer', 'admin'), async (req, res) => {
  try {
    const { userId, eventId, status } = req.body;
    const markedBy = req.user._id;

    if (
      !mongoose.isValidObjectId(userId) ||
      !mongoose.isValidObjectId(eventId) ||
      !mongoose.isValidObjectId(markedBy)
    ) {
      return res.status(400).json({ message: 'Invalid user, event, or marker id' });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const existingAttendance = await Attendance.findOne({ userId, eventId });

    if (!existingAttendance) {
      const attendance = await Attendance.create({ userId, eventId, status, markedBy, markedAt: new Date() });

      if (status === 'present') {
        await Event.findByIdAndUpdate(eventId, { $inc: { attendanceCount: 1 } });
      }

      return res.status(201).json(attendance);
    }

    const previousStatus = existingAttendance.status;
    existingAttendance.status = status;
    existingAttendance.markedBy = markedBy;
    existingAttendance.markedAt = new Date();
    await existingAttendance.save();

    if (previousStatus !== 'present' && status === 'present') {
      await Event.findByIdAndUpdate(eventId, { $inc: { attendanceCount: 1 } });
    }

    if (previousStatus === 'present' && status === 'absent') {
      await Event.findByIdAndUpdate(eventId, { $inc: { attendanceCount: -1 } });
    }

    res.json(existingAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/event/:eventId', requireAuth, requireRole('organizer', 'admin'), async (req, res) => {
  try {
    const attendance = await Attendance.find({ eventId: req.params.eventId })
      .populate('userId', 'name email role')
      .populate('markedBy', 'name email role');

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;