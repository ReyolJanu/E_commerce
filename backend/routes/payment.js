const express = require('express');
const { isAuthendicateUser } = require('../middleware/authendicate');
const { processPayment, sendStripeApi } = require('../controllers/paymentController');
const router = express.Router();

router.route('/payment/process').post(isAuthendicateUser, processPayment);
router.route('/stripeapi').get(isAuthendicateUser, sendStripeApi);

module.exports = router;
