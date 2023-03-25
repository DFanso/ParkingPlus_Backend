const express = require('express');
const multer = require('multer');
const fs = require('fs');
const vision = require('@google-cloud/vision');
const mongoose = require('mongoose');

const app = express();
const router = express.Router();

// Define the cash reduction constants
const CASH_REDUCTION_PER_HOUR = 120;
const CASH_REDUCTION_LESS_THAN_1_HOUR = 100;

const uploadPath = './uploads';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, 'picture.jpg'); // Replace the old image
  }
});

const upload = multer({ storage: storage });

// Connect to MongoDB using Mongoose
// mongoose.connect('mongodb+srv://root:sg9tZlQoKDwaKb7H@cluster0.esptv8v.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB.');
// });

// Define a schema for the recognized text
const activeSessionSchema = new mongoose.Schema({
  plate: String,
  startTime: Date,
  endTime: Date,
  duration: Number,
  active: Boolean
});
const ActiveSession = mongoose.model('ActiveSession', activeSessionSchema);

const BookingsSchema = new mongoose.Schema({
  plate: String,
  active: Boolean
});
const Bookings = mongoose.model('Bookings', BookingsSchema);

const userSchema = new mongoose.Schema({
  username: String,
  plate: String,
  cash: Number
});

const User = mongoose.model('Users', userSchema);

// Initialize the Google Cloud Vision API client
const client = new vision.ImageAnnotatorClient({
  keyFilename: 'onetap-381010-3fcf5cbcb15a.json' //  Google Cloud keyfile
});

router.route("/").post(upload.single('image'), async (req, res) => {
  if (req.file) {
    try {
      // Recognize text using Google Cloud Vision API
      const [result] = await client.textDetection(`${uploadPath}/picture.jpg`);
      const detections = result.textAnnotations;
      console.log('Recognized Text:');

      let textResult = detections[0].description.replace(/ /g, '');
      console.log(textResult);

      // Check if there is an active booking for the license plate
      const booking = await Bookings.findOne({ plate: textResult, active: true });
      if (booking) {
        console.log('Booking found in the database');
        const startTime = new Date();
        const activeSession = await ActiveSession.create({ plate: textResult, startTime: startTime, active: true });
        console.log('Active session created:', activeSession);
        await Bookings.updateOne({ _id: booking._id }, { active: false });
        console.log('Booking updated:', booking);
        res.send('true');
      } else {
        // Check if there is an active session for the license plate
        const activeSession = await ActiveSession.findOne({ plate: textResult, active: true });
        if (activeSession) {
          console.log('Active session found in the database');
          const endTime = new Date();
          const duration = new Date(endTime - activeSession.startTime).getTime() / (1000 * 60 * 60); // Convert duration to hours
          let cashReduction = CASH_REDUCTION_PER_HOUR * Math.floor(duration); // Calculate cash reduction based on duration
          if (duration < 1) {
            cashReduction = CASH_REDUCTION_LESS_THAN_1_HOUR;
          }
          // Find the User document and reduce cash
          const user = await User.findOne({ plate: textResult });
          console.log("user:",user);
          if (user) {
            const updatedCash = user.cash - cashReduction;
            await User.updateOne({ _id: user._id }, { cash: updatedCash });
          }
          await ActiveSession.updateOne({ _id: activeSession._id }, { endTime: endTime, duration: duration, active: false });
          console.log('Active session ended', activeSession);
          // await Bookings.deleteOne({ _id: Bookings._id });
          // console.log('Booking deleted');
          res.send('true');
        } else {
          console.log('No active booking or session for this license plate');
          res.send('false');
        }
      }
    } catch (err) {
      console.error('Error recognizing text or booking not found in the database', err);
      res.send('Error recognizing text or booking not found in the database');
    }
  } else {
    res.send('Error uploading image.');
  }
});

module.exports = router;
    
    // app.listen(port, () => {
    // console.log(`Server is running at ${port}`);
    // });    
