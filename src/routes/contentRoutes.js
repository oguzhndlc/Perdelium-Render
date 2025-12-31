const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const contentController = require("../controllers/contentController");

router.post("/create", auth, contentController.createContent);

module.exports = router;
