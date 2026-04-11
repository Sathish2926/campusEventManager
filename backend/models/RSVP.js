const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['attending', 'cancelled'],
      default: 'attending',
    },
  },
  {
    timestamps: true,
  }
);

rsvpSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('RSVP', rsvpSchema);