const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

router.post("/signup", userController.register);
router.post("/signin", userController.login);
router.post("/updateProfile", userController.updateProfile);
router.get("/username/:username", userController.getUserByUsername);
router.delete("/accdel", auth, userController.deleteAccount);

module.exports = router;