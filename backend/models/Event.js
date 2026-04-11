const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['tech', 'cultural', 'sports'],
      lowercase: true,
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizerName: {
      type: String,
      required: true,
      trim: true,
    },
    mainImage: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailImage: {
      type: String,
      trim: true,
    },
    rsvpCount: {
      type: Number,
      default: 0,
    },
    attendanceCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ title: 1, date: 1, venue: 1 }, { unique: true });

module.exports = mongoose.model('Event', eventSchema);