const router = require("express").Router();
const userController = require("../apis/user/controller");

// login
router.post('/login', userController.getLoginByEmailId);

module.exports = router;