import { apiConnector } from "../apiconnector";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4002";
const POSTS_API = `${BASE_URL}/api/v1/posts`;

// Create post
export const createPost = async (content, token) => {
  const toastId = toast.loading("Creating post...");
  try {
    const response = await apiConnector(
      "POST",
      POSTS_API,
      { content },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    );

    if (response.data && response.data.success) {
      toast.success("Post created successfully!", { id: toastId });
      return response.data;
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to create post", {
      id: toastId
    });
    console.error("Create post error:", error);
  }
  return null;
};

// Get all posts
export const getAllPosts = async (page = 1, limit = 10, token = null) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiConnector(
      "GET",
      `${POSTS_API}?page=${page}&limit=${limit}`,
      null,
      headers
    );

    if (response.data && response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.error("Get posts error:", error);
    toast.error("Failed to fetch posts");
  }
  return null;
};

// Get post by ID
export const getPostById = async (postId, token = null) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiConnector(
      "GET",
      `${POSTS_API}/${postId}`,
      null,
      headers
    );

    if (response.data && response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.error("Get post error:", error);
    toast.error("Failed to fetch post");
  }
  return null;
};

// Update post
export const updatePost = async (postId, content, token) => {
  const toastId = toast.loading("Updating post...");
  try {
    const response = await apiConnector(
      "PUT",
      `${POSTS_API}/${postId}`,
      { content },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    );

    if (response.data && response.data.success) {
      toast.success("Post updated successfully!", { id: toastId });
      return response.data;
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to update post", {
      id: toastId
    });
    console.error("Update post error:", error);
  }
  return null;
};

// Delete post
export const deletePost = async (postId, token) => {
  const toastId = toast.loading("Deleting post...");
  try {
    console.log("Deleting post:", postId);
    
    const response = await apiConnector(
      "DELETE",
      `${POSTS_API}/${postId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    );

    console.log("Delete response:", response);

    if (response?.data?.success) {
      toast.success("Post deleted successfully!", { id: toastId });
      return true;
    } else {
      toast.error(response?.data?.message || "Failed to delete post", { id: toastId });
      return false;
    }
  } catch (error) {
    console.error("Delete post error:", error);
    const errorMsg = error?.response?.data?.message || error?.message || "Failed to delete post";
    toast.error(errorMsg, { id: toastId });
    return false;
  }
};

// Like/Unlike post
export const toggleLikePost = async (postId, token) => {
  try {
    const response = await apiConnector(
      "POST",
      `${POSTS_API}/${postId}/like`,
      null,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    );

    if (response.data && response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    toast.error("Failed to update like status");
  }
  return null;
};
