const express = require('express');
const router = express.Router();
const {getBooking, getInactiveSessions} = require('../controllers/bookingController');
const Booking = require('../models/activeSession');

router.get('/activesession/:id', getBooking);
router.get('/inactive-sessions', getInactiveSessions);

// Booking
router.post('/', async (req, res) => {
    const { plate } = req.body;
  
    try {
      const existingBooking = await Booking.findOne({ plate });
  
      if (existingBooking) {
        existingBooking.active = true;
        await existingBooking.save();
        res.json({ updated: true });
      } else {
        const newBooking = new Booking({ plate, active: true });
        await newBooking.save();
        res.json({ updated: false });
      }
    } catch (error) {
      console.error('Error processing booking:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;
