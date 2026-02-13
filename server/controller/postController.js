const Post = require("../model/post");
const User = require("../model/user");
const Comment = require("../model/comment");
const AdminReply = require("../model/adminReply");

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Post content cannot be empty" 
      });
    }

    if (content.length > 5000) {
      return res.status(400).json({ 
        success: false, 
        message: "Post content cannot exceed 5000 characters" 
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

    // Create post
    const post = await Post.create({
      author: userId,
      authorName: user.name,
      authorRole: user.role,
      content: content.trim()
    });

    // Populate and return
    await post.populate("author", "name email role");

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post
    });
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({
      success: false,
      message: "Post creation failed",
      error: error.message
    });
  }
};

// Get all posts with pagination
exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log(`Fetching posts - Page: ${page}, Limit: ${limit}, Skip: ${skip}`);

    const posts = await Post.find({ isEnabled: true })
      .populate("author", "name email role")
      .populate({
        path: "comments",
        populate: { path: "author", select: "name email" }
      })
      .populate({
        path: "adminReplies",
        populate: { path: "author", select: "name email role" }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(`Posts found: ${posts.length}`);
    posts.forEach((post, idx) => {
      console.log(`Post ${idx}: ${post._id} - Admin Replies: ${post.adminReplies?.length || 0}, Comments: ${post.comments?.length || 0}`);
    });

    const total = await Post.countDocuments({ isEnabled: true });

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
    console.error("Get posts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message
    });
  }
};

// Get post by ID
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate("author", "name email role")
      .populate({
        path: "comments",
        populate: { path: "author", select: "name email" }
      })
      .populate({
        path: "adminReplies",
        populate: { path: "author", select: "name email" }
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error("Get post error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch post",
      error: error.message
    });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Post content cannot be empty"
      });
    }

    // Check ownership
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own posts"
      });
    }

    // Update post
    post.content = content.trim();
    await post.save();

    await post.populate("author", "name email role");

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post
    });
  } catch (error) {
    console.error("Update post error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update post",
      error: error.message
    });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    console.log("Delete post request - ID:", id, "User ID:", userId, "User Role:", userRole);

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format"
      });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Check ownership or admin
    if (post.author.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this post"
      });
    }

    try {
      // Delete related comments and admin replies
      const deleteCommentsResult = await Comment.deleteMany({ post: id });
      const deleteAdminRepliesResult = await AdminReply.deleteMany({ post: id });
      
      console.log("Delete comments result:", deleteCommentsResult);
      console.log("Delete admin replies result:", deleteAdminRepliesResult);

      // Delete post
      const deletedPost = await Post.findByIdAndDelete(id);
      console.log("Deleted post result:", deletedPost ? "Success" : "Failed");

      const responseObj = {
        success: true,
        message: "Post deleted successfully"
      };
      
      console.log("Sending response:", responseObj);
      return res.status(200).json(responseObj);
    } catch (deleteError) {
      console.error("Error during deletion:", deleteError);
      throw deleteError;
    }
  } catch (error) {
    console.error("Delete post error:", error.message);
    console.error("Error stack:", error.stack);
    
    const errorResponse = {
      success: false,
      message: "Failed to delete post",
      error: error.message || "Unknown error"
    };
    
    console.log("Sending error response:", errorResponse);
    return res.status(500).json(errorResponse);
  }
};

// Like/Unlike post
exports.toggleLikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    const alreadyLiked = post.likedBy.includes(userId);

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message: alreadyLiked ? "Post unliked" : "Post liked",
      data: post
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
