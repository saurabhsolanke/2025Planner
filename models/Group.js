// models/group.js
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;