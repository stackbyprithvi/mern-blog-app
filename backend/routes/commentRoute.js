const express = require("express");
const router = express.Router();
const {
  createComments,
  getPostComments,
  deleteComment,
} = require("../controller/commentController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:postId/comments", getPostComments);
router.post("/:postId/comments", protect, createComments);
router.delete("/comments/:id", protect, deleteComment);

module.exports = router;
