
require('dotenv').config({ path: require('path').join(__dirname, '../config/config.env') });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
exports.processPayment = async (req, res, next) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "usd",
            description: "TEST PAYMENT",
            metadata: { integration_check: "accept_payment" },
            shipping: req.body.shipping,
        });

        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Stripe Payment Error:", error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Send Stripe Public API Key
exports.sendStripeApi = async (req, res, next) => {
    try {
        res.status(200).json({
            stripeApiKey: process.env.STRIPE_API_KEY,
        });
    } catch (error) {
        console.error("Send Stripe API Error:", error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
