const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  tasks: [{ description: String, status: { type: String, default: 'pending' } }],
});

module.exports = mongoose.model('Task', TaskSchema);
