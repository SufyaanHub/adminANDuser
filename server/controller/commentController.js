const Comment = require("../model/comment");
const Post = require("../model/post");
const User = require("../model/user");

// Create a comment on a post
exports.createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const userId = req.user.id;

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Comment content cannot be empty"
      });
    }

    if (content.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot exceed 2000 characters"
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Create comment
    const comment = await Comment.create({
      post: postId,
      author: userId,
      authorName: user.name,
      content: content.trim()
    });

    // Add comment to post
    post.comments.push(comment._id);
    await post.save();

    // Populate and return
    await comment.populate("author", "name email role");

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: comment
    });
  } catch (error) {
    console.error("Create comment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create comment",
      error: error.message
    });
  }
};

// Get all comments for a post
exports.getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    const comments = await Comment.find({ post: postId, isEnabled: true })
      .populate("author", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Comment.countDocuments({ post: postId, isEnabled: true });

    return res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalComments: total,
        limit
      }
    });
  } catch (error) {
    console.error("Get comments error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error.message
    });
  }
};

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Comment content cannot be empty"
      });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    // Check ownership
    if (comment.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own comments"
      });
    }

    // Update comment
    comment.content = content.trim();
    await comment.save();

    await comment.populate("author", "name email role");

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: comment
    });
  } catch (error) {
    console.error("Update comment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update comment",
      error: error.message
    });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    console.log("Delete comment request - ID:", id, "User ID:", userId, "User Role:", userRole);

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID format"
      });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    // Check ownership or admin
    if (comment.author.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this comment"
      });
    }

    try {
      // Remove from post
      const updateResult = await Post.findByIdAndUpdate(
        comment.post,
        { $pull: { comments: id } }
      );
      console.log("Updated post after comment removal:", updateResult ? "Success" : "Failed");

      // Delete comment
      const deletedComment = await Comment.findByIdAndDelete(id);
      console.log("Deleted comment:", deletedComment ? "Success" : "Failed");

      const responseObj = {
        success: true,
        message: "Comment deleted successfully"
      };
      
      console.log("Sending response:", responseObj);
      return res.status(200).json(responseObj);
    } catch (deleteError) {
      console.error("Error during deletion:", deleteError);
      throw deleteError;
    }
  } catch (error) {
    console.error("Delete comment error:", error.message);
    console.error("Error stack:", error.stack);
    
    const errorResponse = {
      success: false,
      message: "Failed to delete comment",
      error: error.message || "Unknown error"
    };
    
    console.log("Sending error response:", errorResponse);
    return res.status(500).json(errorResponse);
  }
};

// Like/Unlike comment
exports.toggleLikeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    const alreadyLiked = comment.likedBy.includes(userId);

    if (alreadyLiked) {
      comment.likedBy = comment.likedBy.filter(id => id.toString() !== userId);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      comment.likedBy.push(userId);
      comment.likes += 1;
    }

    await comment.save();

    return res.status(200).json({
      success: true,
      message: alreadyLiked ? "Comment unliked" : "Comment liked",
      data: comment
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle like",
      error: error.message
    });
  }
};
