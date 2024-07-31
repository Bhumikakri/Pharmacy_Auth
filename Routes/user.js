const express = require("express");

const router = express.Router();

const userController = require("../Controler/user");

router.post("/register", userController.userRegister);

router.post("/login", userController.userLogin);

router.post("/logout", userController.userLogout);

module.exports = router;