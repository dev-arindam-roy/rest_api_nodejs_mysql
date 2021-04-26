const router = require("express").Router();

const uploadImage = require("../../helpers/imageUpload");
const userController = require("./controller");
const userValidation = require("./validation");
const loginValidate = require("../../auth/tokenValidate");


// login
router.post('/login', userController.getLoginByEmailId);

// create users
router.post('/create', 
    loginValidate.checkToken,
    uploadImage.single('profile_image'), 
    userValidation.createUserValidation, 
    userController.createUser);

// get all users
router.get('/', loginValidate.checkToken, userController.getAllUsers);

// get user by user id
router.get('/:id', loginValidate.checkToken, userController.getUserByUserId);

module.exports = router;