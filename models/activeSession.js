const mongoose = require('mongoose');

const activeSessionSchema = new mongoose.Schema({
  plate: { type: String, required: true },
  active: { type: Boolean, required: true, default: false },
});

const activeSession = mongoose.model('activeSession', activeSessionSchema, 'bookings');

module.exports = activeSession;
