const express = require('express');
const router = express.Router();
const parkingSpotController = require('../controllers/parkingSpotController');

router.post('/', parkingSpotController.createParkingSpot);
router.get('/:id', parkingSpotController.getParkingSpot);

module.exports = router;
