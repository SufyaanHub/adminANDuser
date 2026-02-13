// Base URL for API requests - adjust according to your backend
const BASE_URL ="http://localhost:4002/api/v1";

// Auth Endpoints
export const endpoints = {
  SIGNUP_API: `${BASE_URL}/auth/signup`,
  LOGIN_API: `${BASE_URL}/auth/login`,
  LOGOUT_API: `${BASE_URL}/auth/logout`,
}

// Post Endpoints
export const postEndpoints = {
  CREATE_POST: `${BASE_URL}/posts`,
  GET_ALL_POSTS: `${BASE_URL}/posts`,
  GET_POST_BY_ID: (postId) => `${BASE_URL}/posts/${postId}`,
  UPDATE_POST: (postId) => `${BASE_URL}/posts/${postId}`,
  DELETE_POST: (postId) => `${BASE_URL}/posts/${postId}`,
  LIKE_POST: (postId) => `${BASE_URL}/posts/${postId}/like`,
}

// Comment Endpoints
export const commentEndpoints = {
  CREATE_COMMENT: `${BASE_URL}/comments`,
  GET_POST_COMMENTS: (postId) => `${BASE_URL}/comments/post/${postId}`,
  UPDATE_COMMENT: (commentId) => `${BASE_URL}/comments/${commentId}`,
  DELETE_COMMENT: (commentId) => `${BASE_URL}/comments/${commentId}`,
  LIKE_COMMENT: (commentId) => `${BASE_URL}/comments/${commentId}/like`,
}

// Admin Endpoints
export const adminEndpoints = {
  POST_ADMIN_REPLY: `${BASE_URL}/admin/reply`,
  GET_ADMIN_REPLIES: (postId) => `${BASE_URL}/admin/replies/${postId}`,
  UPDATE_ADMIN_REPLY: (replyId) => `${BASE_URL}/admin/reply/${replyId}`,
  DELETE_ADMIN_REPLY: (replyId) => `${BASE_URL}/admin/reply/${replyId}`,
  GET_POSTS_FOR_MODERATION: `${BASE_URL}/admin/moderation/posts`,
}
