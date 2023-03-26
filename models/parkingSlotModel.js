const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
    // ... other fields
    available: {
      type: String,
      required: true,
    },
  });
  

const Slot = mongoose.model("parkingSlots", parkingSpotSchema, "parkingslots");

module.exports = Slot;