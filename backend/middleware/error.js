
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;  // Default to 500 if not set

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,    // error handler.js la irunthu than ellm set pannirukam statusCode , message
            stack: err.stack
        });
    } else if (process.env.NODE_ENV === 'production') {
        res.status(err.statusCode).json({
            success: false,
            message: err.message   // In production, do not expose stack trace
        });
    }
};
