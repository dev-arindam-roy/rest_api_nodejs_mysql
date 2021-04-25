const multer = require("multer")
const path = require("path")

const appError = require("../exception/appError");

const storage = multer.diskStorage({
    destination: './public/uploads/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
  
const filter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        return cb(null, true)
    } else {
        return cb(new appError('invalid format', 404), false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000
    },
    fileFilter: filter
})

module.exports = upload;