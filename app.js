const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const trackerRoutes = require('./routes/tracker');
const notesRoutes = require('./routes/notes');
const calendarRoutes = require('./routes/calendar');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));