class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isValid = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;