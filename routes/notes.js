const express = require('express');
const Note = require('../models/Note');

const router = express.Router();




// Render notes page
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find(); // Find all notes
    res.render('notes', { title: 'Your Notes', notes }); // Ensure response is sent
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).send('Internal Server Error'); // Send an error response
  }
});

// Create a new note
router.post('/add', async (req, res) => {
  const { title, content } = req.body;
  try {
    await Note.create({ title, content }); // Create note
    res.redirect('/notes'); // Redirect after creation
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).send('Internal Server Error'); // Send an error response
  }
});

// Delete a note
router.post('/delete/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id); // Delete note
    res.redirect('/notes'); // Redirect after deletion
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).send('Internal Server Error'); // Send an error response
  }
});

module.exports = router;