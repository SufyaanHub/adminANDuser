const express = require("express");
const { verifyToken, authorize } = require("../middleware/authMiddleware");
const {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
  toggleLikeComment
} = require("../controller/commentController");

const router = express.Router();

// Create a comment (authenticated users only)
router.post("/", verifyToken, createComment);

// Get all comments for a post
router.get("/post/:postId", getPostComments);

// Update comment (owner only)
router.put("/:id", verifyToken, updateComment);

// Delete comment (owner or admin)
router.delete("/:id", verifyToken, deleteComment);

// Like/Unlike comment (authenticated users only)
router.post("/:id/like", verifyToken, toggleLikeComment);

module.exports = router;
