const mongoose = require("mongoose");

const adminReplySchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 3000
  },
  isOfficial: {
    type: Boolean,
    default: true
  },
  isEnabled: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("AdminReply", adminReplySchema);
