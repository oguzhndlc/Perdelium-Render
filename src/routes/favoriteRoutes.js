const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const favoriteController = require("../controllers/favoriteController");

// ❤️ Favoriye ekle
router.post("/:contentId", auth, favoriteController.addFavorite);

// 📄 Favorileri getir
router.get("/", auth, favoriteController.getFavorites);

// ❌ Favoriden çıkar
router.delete("/:contentId", auth, favoriteController.removeFavorite);

router.get("/:contentId/is-favorite", auth, favoriteController.isFavorite);

module.exports = router;
