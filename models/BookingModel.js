const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  plate: { type: String, required: true },
  enterTime: { type: String, required: true },
  endedTime: { type: String, required: true },
  active: { type: Boolean, required: true, default: false },
});

const Booking = mongoose.model('Booking', bookingSchema, 'activesessions');

module.exports = Booking;
