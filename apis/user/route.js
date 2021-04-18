const router = require("express").Router();

const userController = require("./controller");

// create users
router.post('/create', userController.createUser);

// get all users
router.get('/', userController.getAllUsers);

// get user by user id
router.get('/:id', userController.getUserByUserId);

module.exports = router;