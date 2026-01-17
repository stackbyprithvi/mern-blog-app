const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate("author", "username");
    res.status(200).json(posts); // return as array
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId }).populate(
      "author",
      "username email",
    );
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(400).json({ message: "Post not found" });
    }
    const userId = req.user._id;
    // ✅ FIX: Handle corrupted likes data
    if (
      !post.likes ||
      !Array.isArray(post.likes) ||
      typeof post.likes === "string"
    ) {
      console.log("⚠️ Corrupted likes data detected, resetting...");
      post.likes = [];
    }

    // Check if user already liked the post
    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString(),
    );

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      // Like
      post.likes.push(userId);
    }
    await post.save();
    const updatedPost = await Post.findById(post._id).populate(
      "author",
      "username",
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Like post error:", err);
    res.status(500).json({ message: err.message });
  }
};

const createPosts = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.create({
      title,
      content,
      author: req.user._id,
    });
    const populatedPost = await post.populate("author", "username");
    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//DELETE POST
const deletePosts = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    // Only author can delete
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not Allowed" });
    }
    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Page not found" });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const { title, content } = req.body;
    post.title = title;
    post.content = content;
    await post.save();
    const updatedPost = await post.populate("author", "username");
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPosts,
  createPosts,
  deletePosts,
  getUserPosts,
  likePost,
  updatePost,
};
