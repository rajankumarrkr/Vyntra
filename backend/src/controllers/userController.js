// Get logged-in user profile
exports.getUserProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const User = require("../models/User");

// Follow user
exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    // Check self-follow
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Check already following
    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: "Already following" });
    }

    // Update both users
    currentUser.following.push(req.params.id);
    userToFollow.followers.push(req.user._id);

    await currentUser.save();
    await userToFollow.save();

    res.json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unfollow user
exports.unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== req.params.id
    );

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID (public profile)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "username avatar")
      .populate("following", "username avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get followers list
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers",
      "username avatar"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.followers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};