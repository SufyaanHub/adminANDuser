import { apiConnector } from "../apiconnector";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4002";
const ADMIN_API = `${BASE_URL}/api/v1/admin`;

// Post admin reply
export const postAdminReply = async (postId, content, token) => {
  const toastId = toast.loading("Posting official reply...");
  try {
    console.log("postAdminReply - Sending request:", { postId, content: content.substring(0, 50) + "..." });
    
    const response = await apiConnector(
      "POST",
      `${ADMIN_API}/reply`,
      { postId, content },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    );

    console.log("postAdminReply - Response received:", response);

    if (response.data && response.data.success) {
      toast.success("Official reply posted successfully!", { id: toastId });
      return response.data;
    } else {
      const errorMsg = response.data?.message || "Failed to post admin reply";
      toast.error(errorMsg, { id: toastId });
      console.error("postAdminReply - Response not successful:", response.data);
    }
  } catch (error) {
    console.error("postAdminReply - Caught exception:", error);
    console.error("Error response:", error.response);
    console.error("Error message:", error.message);
    
    let errorMsg = "Failed to post admin reply";
    
    if (error.response?.status === 403) {
      errorMsg = "You don't have permission to post official replies (admin only)";
    } else if (error.response?.status === 404) {
      errorMsg = "Post not found or user not found";
    } else if (error.response?.status === 400) {
      errorMsg = error.response.data?.message || "Invalid reply content";
    } else if (error.message === "Network Error" || error.code === "ECONNREFUSED") {
      errorMsg = "Cannot connect to server - make sure backend is running";
    } else if (error.code === "ECONNRESET") {
      errorMsg = "Server connection lost - please try again";
    } else {
      errorMsg = error?.response?.data?.message || error?.message || errorMsg;
    }
    
    toast.error(errorMsg, { id: toastId });
  }
  return null;
};

// Get admin replies for a post
export const getAdminReplies = async (postId, token = null) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiConnector(
      "GET",
      `${ADMIN_API}/replies/${postId}`,
      null,
      headers
    );

    if (response.data && response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.error("Get admin replies error:", error);
  }
  return null;
};

// Update admin reply
export const updateAdminReply = async (replyId, content, token) => {
  const toastId = toast.loading("Updating reply...");
  try {
    const response = await apiConnector(
      "PUT",
      `${ADMIN_API}/reply/${replyId}`,
      { content },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    );

    if (response.data && response.data.success) {
      toast.success("Reply updated successfully!", { id: toastId });
      return response.data;
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to update reply", {
      id: toastId
    });
    console.error("Update admin reply error:", error);
  }
  return null;
};

// Delete admin reply
export const deleteAdminReply = async (replyId, token) => {
  const toastId = toast.loading("Deleting reply...");
  try {
    console.log("Deleting admin reply:", replyId);
    
    const response = await apiConnector(
      "DELETE",
      `${ADMIN_API}/reply/${replyId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    );

    console.log("Delete response:", response);

    if (response?.data?.success) {
      toast.success("Reply deleted successfully!", { id: toastId });
      return true;
    } else {
      toast.error(response?.data?.message || "Failed to delete reply", { id: toastId });
      return false;
    }
  } catch (error) {
    console.error("Delete admin reply error:", error);
    const errorMsg = error?.response?.data?.message || error?.message || "Failed to delete reply";
    toast.error(errorMsg, { id: toastId });
    return false;
  }
};

// Get all posts for moderation (Admin Dashboard)
export const getAllPostsForModeration = async (page = 1, limit = 10, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${ADMIN_API}/moderation/posts?page=${page}&limit=${limit}`,
      null,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    );

    console.log("getAllPostsForModeration response:", response);

    if (response.data && response.data.success) {
      console.log("Posts fetched successfully:", response.data.data?.length || 0);
      return response.data;
    } else {
      console.error("Response not successful:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Get posts for moderation error:", error);
    const errorMsg = error?.response?.data?.message || error?.message || "Failed to fetch posts for moderation";
    console.error("Error message:", errorMsg);
    return null;
  }
};
