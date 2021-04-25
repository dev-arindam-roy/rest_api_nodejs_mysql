const validationSchema = require("./validationSchema");
const catchAsync = require("../../exception/catchAsync");

module.exports = {
    createUserValidation: catchAsync (async (req, res, next) => {
        const value = await validationSchema.userData(req.body)
        if (value == 'OK') {
            next()
        }
    })
};