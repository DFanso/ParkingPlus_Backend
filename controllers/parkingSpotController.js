// Importing the ParkingSpot model
const ParkingSpot = require('../models/parkingSpotModel');
const ParkingSlot = require('../models/parkingSlotModel');
// Controller functions

// createParkingSpot: Handles the creation of a new parking spot
const createParkingSpot = async (req, res) => {
  try {
    const { name, location, openTime, closeTime, costPerHour, availableSpots, rating } = req.body;

    // Create a new ParkingSpot instance using the provided data
    const newParkingSpot = new ParkingSpot({
      name,
      location,
      openTime,
      closeTime,
      costPerHour,
      availableSpots,
      rating,
    });

    // Save the new parking spot to the database
    await newParkingSpot.save();

    // Send a success response
    res.status(201).json({ message: 'Parking spot created successfully', data: newParkingSpot });
  } catch (error) {
    // Handle errors and send an error response
    res.status(500).json({ message: 'Failed to create parking spot', error: error.message });
  }
};
const getParkingSpot = async (req, res) => {
    try {
      const parkingSpot = await ParkingSpot.findById(req.params.id);
  
      if (parkingSpot) {
        res.json(parkingSpot);
      } else {
        res.status(404);
        throw new Error('Parking spot not found');
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const getAvailability = async (req, res) => {
    try {
      const parkingSpot = await ParkingSpot.findById(req.params.id);
      res.json({ available: parkingSpot.availableSpots > 0 });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching parking spot availability' });
    }
  };
    
 // Export the controller functions 
  module.exports = {
    createParkingSpot,
    getParkingSpot,
    getAvailability
  }

