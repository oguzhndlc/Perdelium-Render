const express = require("express");
const router = express.Router();

const contentController = require("../controllers/contentController");

router.post("/create", contentController.createContent);

module.exports = router;