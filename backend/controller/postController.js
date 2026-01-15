const Post = require("../models/Post");

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate("author", "username");
    res.status(200).json(posts); // return as array
  } catch (err) {
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
    res.status(400).json({ message: err.message });
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

module.exports = { getPosts, createPosts, deletePosts };
