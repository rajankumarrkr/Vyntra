const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");

// Create post
exports.createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Upload failed" });
        }

        const post = await Post.create({
          user: req.user._id,
          image: result.secure_url,
          caption,
        });

        res.status(201).json(post);
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts (Feed)
exports.getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const posts = await Post.find()
      .populate("user", "username avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like / Unlike post
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const userId = req.user._id;

    if (post.likes.includes(userId)) {
      // Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.json({ likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Comment = require("../models/Comment");
const Notification = require("../models/Notification");

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await Comment.create({
      post: req.params.id,
      user: req.user._id,
      text,
    });

    // Create notification
    const post = await Post.findById(req.params.id);

    if (post.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: post.user,
        type: "comment",
        message: "Someone commented on your post",
      });
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comments for a post
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};