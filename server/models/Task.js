const mongoose = require('mongoose');

/**
 * Task schema — each task belongs to a user.
 *
 * Fields:
 *  - title:       short name (required)
 *  - description: optional details
 *  - priority:    high | medium | low
 *  - dueDate:     deadline (optional)
 *  - status:      pending | in-progress | completed
 *  - user:        reference to the owning User
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title must be at most 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description must be at most 2000 characters'],
      default: '',
    },
    priority: {
      type: String,
      enum: {
        values: ['high', 'medium', 'low'],
        message: 'Priority must be high, medium, or low',
      },
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: 'Status must be pending, in-progress, or completed',
      },
      default: 'pending',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Index for fast queries filtered by user + status / priority
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
