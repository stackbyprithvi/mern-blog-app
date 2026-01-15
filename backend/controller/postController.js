const Post = require("../models/Post");

const getPosts = async (req, res, next) => {
  try {
    const post = await Post.find({}).populate("author");
    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const createPosts = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.create({
      title: title,
      content: content,
      author: req.user._id,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deletePosts = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPosts, createPosts, deletePosts };
