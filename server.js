const express = require("express");
const connectDB = require("./db");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const userRouter = require('./routes/userRoutes');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const parkSpot = require('./routes/parkingSpotRoute');
const bookingRoute = require('./routes/bookingRoute');

dotenv.config();
connectDB()

const app = express();

app.use(bodyParser.json()); //To parse JSON Data
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get("/", (req, res) => {
    res.send('API is running');
});
// PayPal Code Start
app.get('/create-payment', (req, res) => {
  // Replace with your PayPal client ID and secret
  const CLIENT_ID = 'AR2Ev6o6_rH-r1xKXRYG4ohg2NIWq397YGDT6_AFknjm8B3tUDsJdDS-OF-UjizxHPSDasg_opp0Z8Cq';
  const SECRET = 'EKPKUdRSHjSTUqFcjEu_6LTXTzGopB8b46Ej4E7GxUH6iMFLpNK1BjX2xSfyZH2vnysqOmwcnT4Dx89Y';
  const PAYPAL_API = 'https://api-m.sandbox.paypal.com';

  const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64');

  const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`
  };

  const body = {
      intent: 'CAPTURE',
      purchase_units: [{
          amount: {
              currency_code: 'USD',
              value: '10.00'
          }
      }],
      application_context: {
          return_url: 'http://20.2.80.190:19006/success',
          cancel_url: 'http://20.2.80.190:19006/cancel'
      }
  };

  fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
  })
      .then(response => {
          if (!response.ok) {
              return response.text().then(text => {
                  throw new Error(`PayPal API error: ${text}`);
              });
          }
          return response.json();
      })
      .then(data => {
          const { id, links } = data;
          const approvalLink = links.find(link => link.rel === 'approve');
          res.json({ id, approvalLink: approvalLink.href });
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({ error: err.message });
      });
});
// PayPal Code End
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  next();
});

app.use('/api/user', userRouter)
app.use('/api/create-park', parkSpot)
app.use('/api/bookings', bookingRoute);

// Error
app.use(notFound)
app.use(errorHandler)

// Set the listening port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
