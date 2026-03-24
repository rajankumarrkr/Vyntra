const express = require("express");
const router = express.Router();   // 🔥 THIS LINE WAS MISSING

const {
  getUserProfile,
  followUser,
  unfollowUser,
  getUserById,
  getFollowers,
} = require("../controllers/userController");


const { protect } = require("../middleware/authMiddleware");

// Routes
router.get("/me", protect, getUserProfile);
router.get("/:id", protect, getUserById);
router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);
router.get("/:id/followers", protect, getFollowers);


module.exports = router;