const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/signup", userController.register);
router.post("/signin", userController.login);
router.post("/updateProfile", userController.updateProfile);

module.exports = router;