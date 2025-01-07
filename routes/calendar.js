const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// Render calendar page
router.get('/', async (req, res) => { // Removed authMiddleware
  const tasks = await Task.find(); // Find all tasks
  res.render('calendar', { title: 'Your Calendar', tasks });
});

module.exports = router;