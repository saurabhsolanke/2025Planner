const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const Task = require('./models/Task');
const Group = require('./models/Group');
const cors = require('cors');
require('dotenv').config();

const trackerRoutes = require('./routes/tracker');
const notesRoutes = require('./routes/notes');
const calendarRoutes = require('./routes/calendar');

const app = express();
// CORS Middleware - Add this before other middleware
app.use(cors({
  origin: ['http://localhost:3000'], // Add your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Sample data structure to hold tasks
let tasks = [];
// Create User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);
// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Find user in database
      const user = await User.findOne({ username });

      if (!user) {
          return res.status(401).json({
              success: false,
              message: 'User not found'
          });
      }

      // In a real application, you should hash passwords and compare hashed values
      if (user.password === password) {
          res.json({
              success: true,
              message: 'Login successful'
          });
      } else {
          res.status(401).json({
              success: false,
              message: 'Invalid credentials'
          });
      }
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Server error',
          error: error.message
      });
  }
});

// Registration route
app.post('/register', async (req, res) => {
  console.log('***********************************************Request received:', req.body); // Log incoming request

  const { username, password } = req.body;

  try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          console.log('Username already exists:', username); // Log existing user
          return res.status(400).json({
              success: false,
              message: 'Username already exists'
          });
      }

      const user = new User({ username, password });
      await user.save();

      console.log('User registered successfully:', user); // Log success
      res.status(201).json({
          success: true,
          message: 'User registered successfully'
      });
  } catch (error) {
      console.error('Error occurred:', error.message); // Log errors
      res.status(500).json({
          success: false,
          message: 'Server error',
          error: error.message
      });
  }
});

// Route to render the calendar page
// app.get('/calendar', async (req, res) => {
//   try {
//     const tasks = await Task.find(); // Retrieve all tasks from MongoDB
//     const selectedDate = req.query.date || new Date().toISOString().split('T')[0]; // Default to today if no date is selected
//     // res.render('calendar', { title: 'Calendar', tasks: tasks });
//     res.render('calendar', { tasks, selectedDate }); // Pass tasks and selectedDate to the template
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

app.get('/calendar', async (req, res) => {
  try {
    const selectedDate = req.query.date || new Date().toISOString().split('T')[0];
    const tasks = await Task.find();
    res.json({ tasks, selectedDate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// async function getTasksByDate(date) {
//   try {
//       // Find tasks for the given date
//       const tasks = await Task.find({ date: date });
//       return tasks; // Return the found tasks
//   } catch (error) {
//       console.error('Error fetching tasks by date:', error);
//       return []; // Return an empty array in case of error
//   }
// }

// // New API endpoint to get tasks by date
// app.get('/calendar/:date', (req, res) => {
//   const dateParam = req.params.date; // Get the date from the URL
//   console.log(dateParam, "*")
//   const date = new Date(dateParam); // Convert to Date object
//   // Fetch tasks from your data source (e.g., database)
//   // This is a placeholder for your actual data fetching logic
//   const tasks = getTasksByDate(date); // Implement this function based on your data source
//   console.log(date, "**");
//   if (tasks) {
//     res.status(200).json(tasks);
//     console.log("status 200");
//   } else {
//     res.status(404).json({ message: 'No tasks found for this date.' });
//   }
// });

// Route to handle adding a task
// app.post('/calendar/add', async (req, res) => {
//   const { date, task } = req.body;
//   const taskDate = new Date(date);
//   try {
//     let taskEntry = await Task.findOne({ date: taskDate });
//     if (taskEntry) {
//       taskEntry.tasks.push({ description: task, status: 'Pending' });
//       await taskEntry.save();
//     } else {
//       taskEntry = new Task({ date: taskDate, tasks: [{ description: task, status: 'Pending' }] });
//       await taskEntry.save();
//     }
//     res.redirect('/calendar');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

app.post('/calendar/add', async (req, res) => {
  const { date, task } = req.body;
  const taskDate = new Date(date);
  try {
    let taskEntry = await Task.findOne({ date: taskDate });
    if (taskEntry) {
      taskEntry.tasks.push({ description: task, status: 'Pending' });
      await taskEntry.save();
    } else {
      taskEntry = new Task({
        date: taskDate,
        tasks: [{ description: task, status: 'Pending' }]
      });
      await taskEntry.save();
    }
    res.json({ success: true, task: taskEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Edit task endpoint
app.put('/calendar/edit', async (req, res) => {
  const { date, taskId, newDescription } = req.body;
  const taskDate = new Date(date);
  
  try {
    const taskEntry = await Task.findOne({ date: taskDate });
    if (!taskEntry) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const taskToUpdate = taskEntry.tasks.id(taskId);
    if (!taskToUpdate) {
      return res.status(404).json({ error: 'Task not found' });
    }

    taskToUpdate.description = newDescription;
    await taskEntry.save();

    res.json({ success: true, task: taskEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete task endpoint
app.delete('/calendar/delete', async (req, res) => {
  const { date, taskId } = req.body;
  const taskDate = new Date(date);
  
  try {
    const taskEntry = await Task.findOne({ date: taskDate });
    if (!taskEntry) {
      return res.status(404).json({ error: 'Task not found' });
    }

    taskEntry.tasks = taskEntry.tasks.filter(task => task._id.toString() !== taskId);
    await taskEntry.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}); 

// Route to handle editing a task
app.post('/calendar/edit/:date/:index', async (req, res) => {
  const { date, index } = req.params;
  const { description, status } = req.body;

  try {
    // Convert the date string back to a Date object
    const taskDate = new Date(date);

    // Find the task entry for the specific date
    const taskEntry = await Task.findOne({ date: taskDate });

    if (taskEntry) {
      // Update the specific task using the index
      taskEntry.tasks[index] = { description, status };
      await taskEntry.save(); // Save the updated task entry
    }

    res.redirect('/calendar'); // Redirect back to the calendar page
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle deleting a task
app.post('/calendar/delete/:date/:index', async (req, res) => {
  const { date, index } = req.params;

  try {
    // Convert the date string back to a Date object
    const taskDate = new Date(date);

    // Find the task entry for the specific date
    const taskEntry = await Task.findOne({ date: taskDate });

    if (taskEntry) {
      // Remove the task at the specified index
      taskEntry.tasks.splice(index, 1);
      await taskEntry.save(); // Save the updated task entry
    }

    res.redirect('/calendar'); // Redirect back to the calendar page
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle deleting all tasks for a specific date
app.post('/calendar/delete-all/:date', async (req, res) => {
  const { date } = req.params;

  try {
    // Convert the date string back to a Date object
    const taskDate = new Date(date);

    // Delete the task entry for the specific date
    await Task.deleteOne({ date: taskDate });

    res.redirect('/calendar'); // Redirect back to the calendar page
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine (if using EJS or similar)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
// Remove the authRoutes
app.use('/tracker', trackerRoutes);
app.use('/notes', notesRoutes);
app.use('/calendar', calendarRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('index', { title: 'Daily Tracker App' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 8000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));