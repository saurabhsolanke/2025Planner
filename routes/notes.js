const express = require('express');
const Note = require('../models/Note');
const Group = require('../models/Group');

const router = express.Router();


// Route to create a new group
router.post('/groups/add', async (req, res) => {
  const { name } = req.body;
  try {
    const newGroup = new Group({ name });
    await newGroup.save();
    res.redirect('/groups'); // Redirect to the groups page
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to get all groups
router.get('/groups', async (req, res) => {
  try {
    const groups = await Group.find().populate('notes'); // Populate notes for each group
    res.render('groups', { groups });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Render notes page
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find(); // Find all notes
    const groups = await Group.find(); // Fetch groups to display in the dropdown
    res.render('notes', { title: 'Your Notes', notes,groups }); // Ensure response is sent
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).send('Internal Server Error'); // Send an error response
  }
});

// Create a new note
router.post('/add', async (req, res) => {
  const { title, content, group } = req.body;
  try {
    await Note.create({ title, content, group }); // Create note
    res.redirect('/notes'); // Redirect after creation
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).send('Internal Server Error'); // Send an error response
  }
});

// Create a new note
// app.post('/notes/add', async (req, res) => {
//   const { title, content, group } = req.body; // Include group in the request
//   try {
//     const newNote = new Note({ title, content, group });
//     await newNote.save();

//     // Find the group and add the note to it
//     const groupEntry = await Group.findOne({ name: group });
//     if (groupEntry) {
//       groupEntry.notes.push(newNote._id);
//       await groupEntry.save();
//     }

//     res.redirect('/notes'); // Redirect after creation
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

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

// Get edit note form
router.get('/edit/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send('Note not found');
    }
    res.render('edit-note', { title: 'Edit Note', note });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Update note
router.post('/edit/:id', async (req, res) => {
  const { title, content } = req.body;
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id, 
      { title, content },
      { new: true, runValidators: true } // This ensures we get the updated document and run validators
    );
    
    if (!updatedNote) {
      return res.status(404).send('Note not found');
    }
    
    return res.redirect('/notes'); // Add return statement and ensure redirect happens after successful update
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;