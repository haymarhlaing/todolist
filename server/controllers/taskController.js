const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Build a MongoDB filter object from query parameters.
 * Only returns tasks belonging to the authenticated user.
 */
const buildFilter = (user, query) => {
  const filter = { user: user._id };

  if (query.status) {
    filter.status = query.status;
  }
  if (query.priority) {
    filter.priority = query.priority;
  }

  // Free-text search: match against title or description
  if (query.search) {
    const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { title: { $regex: escaped, $options: 'i' } },
      { description: { $regex: escaped, $options: 'i' } },
    ];
  }

  return filter;
};

// ─── CRUD ───────────────────────────────────────────────────────────────────

/**
 * GET /api/tasks
 * Fetch all tasks for the authenticated user, with optional filters & search.
 */
const getTasks = async (req, res) => {
  try {
    const filter = buildFilter(req.user, req.query);
    const sort = req.query.sort === 'dueDate' ? { dueDate: 1 } : { createdAt: -1 };

    const tasks = await Task.find(filter).sort(sort);
    res.json({ count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

/**
 * GET /api/tasks/stats
 * Return dashboard statistics for the authenticated user.
 */
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const [total, completed, pending, overdue] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: 'completed' }),
      Task.countDocuments({ user: userId, status: { $in: ['pending', 'in-progress'] } }),
      Task.countDocuments({
        user: userId,
        status: { $in: ['pending', 'in-progress'] },
        dueDate: { $ne: null, $lt: now },
      }),
    ]);

    res.json({ total, completed, pending, overdue });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

/**
 * POST /api/tasks
 * Create a new task.
 */
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  try {
    const task = await Task.create({ ...req.body, user: req.user._id });
    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating task' });
  }
};

/**
 * GET /api/tasks/:id
 * Get a single task by id (must belong to the authenticated user).
 */
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching task' });
  }
};

/**
 * PUT /api/tasks/:id
 * Update a task.
 */
const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating task' });
  }
};

/**
 * DELETE /api/tasks/:id
 * Remove a task.
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

module.exports = { getTasks, getStats, createTask, getTask, updateTask, deleteTask };
