const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorRole: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 5000
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  adminReplies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminReply"
    }
  ],
  isEnabled: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
