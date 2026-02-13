const express = require("express");
const { verifyToken, authorize } = require("../middleware/authMiddleware");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLikePost
} = require("../controller/postController");

const router = express.Router();

// Create a post (authenticated users only)
router.post("/", verifyToken, createPost);

// Get all posts
router.get("/", getAllPosts);

// Get post by ID
router.get("/:id", getPostById);

// Update post (owner only)
router.put("/:id", verifyToken, updatePost);

// Delete post (owner or admin)
router.delete("/:id", verifyToken, deletePost);

// Like/Unlike post (authenticated users only)
router.post("/:id/like", verifyToken, toggleLikePost);

module.exports = router;
