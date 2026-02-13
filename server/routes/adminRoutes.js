const express = require("express");
const { verifyToken, authorize } = require("../middleware/authMiddleware");
const {
  postAdminReply,
  getAdminReplies,
  updateAdminReply,
  deleteAdminReply,
  getAllPostsForModeration
} = require("../controller/adminController");

const router = express.Router();

// Post admin reply (admin only)
router.post("/reply", verifyToken, authorize(["admin"]), postAdminReply);

// Get admin replies for a post
router.get("/replies/:postId", getAdminReplies);

// Update admin reply (admin only)
router.put("/reply/:id", verifyToken, authorize(["admin"]), updateAdminReply);

// Delete admin reply (admin only)
router.delete("/reply/:id", verifyToken, authorize(["admin"]), deleteAdminReply);

// Get all posts for moderation (admin only)
router.get("/moderation/posts", verifyToken, authorize(["admin"]), getAllPostsForModeration);

module.exports = router;
