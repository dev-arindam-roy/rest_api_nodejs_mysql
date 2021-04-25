const router = require("express").Router();

const uploadImage = require("../../helpers/imageUpload");
const userController = require("./controller");
const userValidation = require("./validation");

// create users
router.post('/create', 
    uploadImage.single('profile'), 
    userValidation.createUserValidation, 
    userController.createUser);

// get all users
router.get('/', userController.getAllUsers);

// get user by user id
router.get('/:id', userController.getUserByUserId);

module.exports = router;