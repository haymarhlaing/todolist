const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  getTasks,
  getStats,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

// All task routes require authentication
router.use(protect);

// GET /api/tasks/stats — must be declared BEFORE /:id so "stats" isn't treated as an id
router.get('/stats', getStats);

// GET /api/tasks
router.get('/', getTasks);

// POST /api/tasks
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('priority').optional().isIn(['high', 'medium', 'low']).withMessage('Invalid priority'),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  ],
  createTask
);

// GET /api/tasks/:id
router.get('/:id', getTask);

// PUT /api/tasks/:id
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('priority').optional().isIn(['high', 'medium', 'low']).withMessage('Invalid priority'),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  ],
  updateTask
);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

module.exports = router;
