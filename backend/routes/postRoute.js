const express = require("express");
const router = express.Router();
const {
  getPosts,
  createPosts,
  deletePosts,
} = require("../controller/postController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getPosts);
router.post("/", protect, createPosts);
router.delete("/:id", protect, deletePosts);

module.exports = router;
