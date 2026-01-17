const express = require("express");
const router = express.Router();
const {
  getPosts,
  createPosts,
  deletePosts,
  getUserPosts,
  likePost,
  updatePost,
} = require("../controller/postController");
const { protect } = require("../middleware/authMiddleware");

//PUBLIC ROUTE
router.get("/", getPosts);
router.get("/user/:userId", getUserPosts);

//PROTECTED ROUTES
router.post("/", protect, createPosts);
router.post("/:postId", protect, createPosts);
router.post("/:id/like", protect, likePost);
router.delete("/:id", protect, deletePosts);
router.put("/:id", protect, updatePost);

module.exports = router;
