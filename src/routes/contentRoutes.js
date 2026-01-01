const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const contentController = require("../controllers/contentController");

router.post("/create", auth, contentController.createContent);
router.get("/my", auth, contentController.getMyContents);
router.get("/suggestions", contentController.getSuggestionContents);
router.get("/all", contentController.getAllContents);
router.get("/:id", contentController.getContentById);
router.delete("/condel/:id",auth,contentController.deleteContent);
router.get("/:contentId",auth,contentController.getFavorites)
router.post("/:contentId",auth,contentController.addFavorite)
router.delete("/:contentId",auth,contentController.removeFavorite)


module.exports = router;
