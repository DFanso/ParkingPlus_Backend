const Booking = require('../models/BookingModel');

const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      res.json(booking);
    } else {
      res.status(404);
      throw new Error('Booking not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInactiveSessions = async (req, res) => {
  try {
    const inactiveSessions = await Booking.find({ active: false });

    if (inactiveSessions) {
      res.json(inactiveSessions);
    } else {
      res.status(404);
      throw new Error('Inactive sessions not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  getBooking, getInactiveSessions
};
