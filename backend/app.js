const express = require('express');
const app = express();
const errorMiddleware = require('./middleware/error'); // Ensure this is the correct path
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order')

app.use('/api/v1/', products); // The correct route prefix
app.use('/api/v1/', auth);
app.use('/api/v1/', order);

app.use(errorMiddleware);  // Error middleware should be the last middleware

module.exports = app;
