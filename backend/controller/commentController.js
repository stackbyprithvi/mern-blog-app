const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

// POST COMMENT
const createComments = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;
    if (!content) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user._id,
    });
    const populatedComment = await comment.populate("author", "username");
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// GET COMMENTS
const getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    }).populate("author", "username");
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE COMMENT
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only author can delete
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createComments, getPostComments, deleteComment };
