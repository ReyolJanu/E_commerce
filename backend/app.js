
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const errorMiddleware = require('./middleware/error'); // Ensure this is the correct path
const cookieParser = require('cookie-parser');
const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');
const cors = require('cors');
const path = require('path');
const payment = require('./routes/payment');

dotenv.config({ path: path.join(__dirname, "config/config.env") });

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

app.use('/api/v1/', products); // The correct route prefix
app.use('/api/v1/', auth);
app.use('/api/v1/', order);
app.use('/api/v1/', payment);

app.use(errorMiddleware);  // Error middleware should be the last middleware

module.exports = app;