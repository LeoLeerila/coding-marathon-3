const express = require('express');
const cors = require('cors');
const vehicleRentalRouter = require('./routes/vehicleRentalRouter');
const userRouter = require("./routes/userRouter");
const { unknownEndpoint, errorHandler, requestLogger } = require('./middleware/customMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);


app.use('/api/vehicleRentals', vehicleRentalRouter);
app.use("/api/auth", userRouter);
app.use(express.static('view')); // Serve static files from 'view'
// Error handling
app.use('/api', unknownEndpoint);
app.use(errorHandler);
app.use((req, res) => {
  res.sendFile(__dirname + '/view/index.html');
});
// Routes
module.exports = app;
