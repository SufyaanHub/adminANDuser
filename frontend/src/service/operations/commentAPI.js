import { apiConnector } from "../apiconnector";
import { toast } from "react-hot-toast";
import { commentEndpoints } from "../apis";

const getBaseURL = () => {
  if (window.location.hostname === 'adminuser-self.vercel.app') {
    return 'https://adminanduser.onrender.com';
  }
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '');
  }
  return 'http://localhost:4002';
};

const COMMENTS_API = `${getBaseURL()}/api/v1/comments`;

// Create comment
export const createComment = async (postId, content, token) => {
  const toastId = toast.loading("Adding comment...");
  try {
    const response = await apiConnector(
      "POST",
      COMMENTS_API,
      { postId, content },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    );

    if (response.data && response.data.success) {
      toast.success("Comment added successfully!", { id: toastId });
      return response.data;
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to add comment", {
      id: toastId
    });
    console.error("Create comment error:", error);
  }
  return null;
};

// Get comments for a post
export const getPostComments = async (postId, page = 1, limit = 10, token = null) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiConnector(
      "GET",
      `${COMMENTS_API}/post/${postId}?page=${page}&limit=${limit}`,
      null,
      headers
    );

    if (response.data && response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.error("Get comments error:", error);
    toast.error("Failed to fetch comments");
  }
  return null;
};

// Update comment
export const updateComment = async (commentId, content, token) => {
  const toastId = toast.loading("Updating comment...");
  try {
    const response = await apiConnector(
      "PUT",
      `${COMMENTS_API}/${commentId}`,
      { content },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    );

    if (response.data && response.data.success) {
      toast.success("Comment updated successfully!", { id: toastId });
      return response.data;
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to update comment", {
      id: toastId
    });
    console.error("Update comment error:", error);
  }
  return null;
};

// Delete comment
export const deleteComment = async (commentId, token) => {
  const toastId = toast.loading("Deleting comment...");
  try {
    console.log("Deleting comment:", commentId);
    
    const response = await apiConnector(
      "DELETE",
      `${COMMENTS_API}/${commentId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    );

    console.log("Delete response:", response);

    if (response?.data?.success) {
      toast.success("Comment deleted successfully!", { id: toastId });
      return true;
    } else {
      toast.error(response?.data?.message || "Failed to delete comment", { id: toastId });
      return false;
    }
  } catch (error) {
    console.error("Delete comment error:", error);
    const errorMsg = error?.response?.data?.message || error?.message || "Failed to delete comment";
    toast.error(errorMsg, { id: toastId });
    return false;
  }
};

// Like/Unlike comment
export const toggleLikeComment = async (commentId, token) => {
  try {
    const response = await apiConnector(
      "POST",
      `${COMMENTS_API}/${commentId}/like`,
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
