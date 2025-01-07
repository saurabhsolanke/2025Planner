const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get tasks for a specific date
router.get('/:date', authMiddleware, async (req, res) => {
  const { date } = req.params;
  const tasks = await Task.findOne({ userId: req.user.id, date });
  res.json(tasks || { date, tasks: [] });
});

// Add or update tasks for a date
router.post('/:date', authMiddleware, async (req, res) => {
  const { date } = req.params;
  const { tasks } = req.body;
  let taskEntry = await Task.findOne({ userId: req.user.id, date });

  if (!taskEntry) {
    taskEntry = new Task({ userId: req.user.id, date, tasks });
  } else {
    taskEntry.tasks = tasks;
  }

  await taskEntry.save();
  res.json(taskEntry);
});

module.exports = router;
