// Importing mongoose library
const mongoose = require('mongoose');

// Define the parkingSpotModel schema
const parkingSpotSchema = new mongoose.Schema({
  name: {type: String, required: true},
  location: { type: String, required: true },
  openTime: { type: String, required: true },
  closeTime: { type: String, required: true },
  costPerHour: { type: Number, required: true },
  availableSpots: { type: Number, required: true },
  rating: { type: Number, min: 0, max: 5 },
});

// Create the ParkingSpot model using the parkingSpotSchema
const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);

// Export the ParkingSpot model for use in other modules
module.exports = ParkingSpot;
