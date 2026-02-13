const AdminReply = require("../model/adminReply");
const Post = require("../model/post");
const User = require("../model/user");

// Admin posts official reply to a post
exports.postAdminReply = async (req, res) => {
  try {
    console.log("=== postAdminReply called ===");
    console.log("Request body:", req.body);
    console.log("User:", req.user);
    
    const { postId, content } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    console.log("Extracted - postId:", postId, "userId:", userId, "userRole:", userRole);

    // Check admin role
    if (userRole !== "admin") {
      console.log("User is not admin, role:", userRole);
      return res.status(403).json({
        success: false,
        message: "Only admins can post official replies"
      });
    }

    // Validation
    if (!content || content.trim().length === 0) {
      console.log("Content is empty");
      return res.status(400).json({
        success: false,
        message: "Reply content cannot be empty"
      });
    }

    if (content.length > 3000) {
      console.log("Content too long:", content.length);
      return res.status(400).json({
        success: false,
        message: "Reply cannot exceed 3000 characters"
      });
    }

    // Check if post exists
    console.log("Checking if post exists:", postId);
    const post = await Post.findById(postId);
    if (!post) {
      console.log("Post not found");
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }
    console.log("Post found:", post._id);

    // Get user details
    console.log("Checking if user exists:", userId);
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    console.log("User found:", user.name);

    // Create admin reply
    console.log("Creating admin reply...");
    const adminReply = await AdminReply.create({
      post: postId,
      author: userId,
      content: content.trim(),
      isOfficial: true
    });
    console.log("Admin reply created:", adminReply._id);

    // Add reply to post
    console.log("Adding reply to post...");
    post.adminReplies.push(adminReply._id);
    await post.save();
    console.log("Post updated with reply");

    // Populate and return
    console.log("Populating author...");
    await adminReply.populate("author", "name email role");

    console.log("Sending success response");
    return res.status(201).json({
      success: true,
      message: "Admin reply posted successfully",
      data: adminReply
    });
  } catch (error) {
    console.error("=== postAdminReply ERROR ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Failed to post admin reply",
      error: error.message
    });
  }
};

// Get all admin replies for a post
exports.getAdminReplies = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    const replies = await AdminReply.find({ post: postId, isEnabled: true })
      .populate("author", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: replies,
      count: replies.length
    });
  } catch (error) {
    console.error("Get admin replies error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin replies",
      error: error.message
    });
  }
};

// Update admin reply
exports.updateAdminReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check admin role
    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can update admin replies"
      });
    }

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Reply content cannot be empty"
      });
    }

    const adminReply = await AdminReply.findById(id);
    if (!adminReply) {
      return res.status(404).json({
        success: false,
        message: "Admin reply not found"
      });
    }

    // Check ownership
    if (adminReply.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own replies"
      });
    }

    // Update reply
    adminReply.content = content.trim();
    await adminReply.save();

    await adminReply.populate("author", "name email role");

    return res.status(200).json({
      success: true,
      message: "Admin reply updated successfully",
      data: adminReply
    });
  } catch (error) {
    console.error("Update admin reply error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update admin reply",
      error: error.message
    });
  }
};

// Delete admin reply
exports.deleteAdminReply = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check admin role
    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete admin replies"
      });
    }

    const adminReply = await AdminReply.findById(id);
    if (!adminReply) {
      return res.status(404).json({
        success: false,
        message: "Admin reply not found"
      });
    }

    // Check ownership
    if (adminReply.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own replies"
      });
    }

    try {
      // Remove from post
      const updateResult = await Post.findByIdAndUpdate(
        adminReply.post,
        { $pull: { adminReplies: id } }
      );
      console.log("Updated post after admin reply removal:", updateResult ? "Success" : "Failed");

      // Delete reply
      const deletedReply = await AdminReply.findByIdAndDelete(id);
      console.log("Deleted admin reply:", deletedReply ? "Success" : "Failed");

      const responseObj = {
        success: true,
        message: "Admin reply deleted successfully"
      };
      
      console.log("Sending response:", responseObj);
      return res.status(200).json(responseObj);
    } catch (deleteError) {
      console.error("Error during deletion:", deleteError);
      throw deleteError;
    }
  } catch (error) {
    console.error("Delete admin reply error:", error.message);
    console.error("Error stack:", error.stack);
    
    const errorResponse = {
      success: false,
      message: "Failed to delete admin reply",
      error: error.message || "Unknown error"
    };
    
    console.log("Sending error response:", errorResponse);
    return res.status(500).json(errorResponse);
  }
};

// Get all posts (for admin moderation dashboard)
exports.getAllPostsForModeration = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check admin role
    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access moderation dashboard"
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("author", "name email role")
      .populate({
        path: "comments",
        populate: { path: "author", select: "name email" }
      })
      .populate({
        path: "adminReplies",
        populate: { path: "author", select: "name email" }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments();

    return res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        limit
      }
    });
  } catch (error) {
    console.error("Get posts for moderation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message
    });
  }
};
