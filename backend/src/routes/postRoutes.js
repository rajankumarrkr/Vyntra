const express = require("express");
const router = express.Router();

const { createPost } = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");
const { getFeed } = require("../controllers/postController");
const { toggleLike } = require("../controllers/postController");
const { addComment, getComments } = require("../controllers/postController");
const upload = require("../middleware/upload");

router.post("/", protect, upload.single("image"), createPost);
router.get("/feed", protect, getFeed);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);
router.get("/:id/comments", protect, getComments);

module.exports = router;