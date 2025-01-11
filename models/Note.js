const mongoose = require('mongoose');

// const NoteSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   title: { type: String, required: true },
//   content: { type: String, required: true },
// });

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Optional reference to User model
  },
  group: { type: String, required: true },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model('Note', noteSchema);
