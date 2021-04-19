const sendDevError = (err, res) => {
    const errorStatusCode = err.statusCode || 500;
    res.status(errorStatusCode).json({
        success:0,
        error_msg: err.message,
        error_stck: err.stack
    });
}

const sendProdError = (err, res) => {
    const errorStatusCode = err.statusCode || 500;
    if (err.isValid) {
        res.status(errorStatusCode).json({
            success:0,
            error_msg: err.message
        });
    } else {
        res.status(errorStatusCode).json({
            success:0,
            error_msg: "Invalid error: something went wrong"
        });
    }
}

module.exports = (err, req, res, next) => {
    if (process.env.APP_ENV === 'dev') {
        sendDevError(err, res);
    } else {
        sendProdError(err, res);
    }
}