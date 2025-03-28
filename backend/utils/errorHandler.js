class ErrorHandler extends Error {
    constructor(message, statusCode){
        super(message)  //parentclass
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ErrorHandler; 