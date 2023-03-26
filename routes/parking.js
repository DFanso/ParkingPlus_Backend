const express = require('express');
const app = express();
const mongoose = require('mongoose');

const router = express.Router();

const parkingSlotSchema = new mongoose.Schema({
    available: String
  });
  const parkingSlot = mongoose.model('parkingSlot', parkingSlotSchema);

  router.route("/").get( async (req, res) => {

    const status = req.query.bothOccupied;
    console.log(status);
    console.log('node value: ',req.query.bothOccupied)
  
    const parking = await parkingSlot.findOne({ id: 1 });
    console.log(parking);
              await parkingSlot.updateOne({ id: 1 }, { available: status });
              console.log('status updated:', parkingSlot);
  
    res.send('Data received');
  });
  

module.exports = router