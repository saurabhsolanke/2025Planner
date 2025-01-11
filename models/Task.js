const mongoose = require('mongoose');

// const TaskSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   date: { type: Date, required: true },
//   tasks: [{ description: String, status: { type: String, default: 'pending' } }],
// });

const taskSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  tasks: [
    {
      description: { type: String, required: true },
      status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
    }
  ]
});

// module.exports = Task;
module.exports = mongoose.model('Task', taskSchema);
