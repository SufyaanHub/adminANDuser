import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Heart, MessageCircle, Share2, Loader, Trash2 } from 'lucide-react';
import { logout } from '../service/operations/authAPI';
import { createPost, getAllPosts, toggleLikePost, deletePost } from '../service/operations/postAPI';
import { createComment, getPostComments, deleteComment } from '../service/operations/commentAPI';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [postComments, setPostComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchPosts();
  }, [token]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      console.log("fetchPosts - Getting posts...");
      const response = await getAllPosts(1, 10, token);
      console.log("fetchPosts - Response:", response);
      
      if (response?.success) {
        console.log("fetchPosts - Posts data:", response.data);
        response.data?.forEach((post, idx) => {
          console.log(`Post ${idx}: ${post._id} - Admin Replies: ${post.adminReplies?.length || 0}, Comments: ${post.comments?.length || 0}`);
          if (post.adminReplies?.length > 0) {
            console.log(`  Admin Replies:`, post.adminReplies);
          }
        });
        setPosts(response.data || []);
      } else {
        console.error("fetchPosts - Response not successful:", response);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentsForPost = async (postId) => {
    try {
      const response = await getPostComments(postId, 1, 100, token);
      if (response?.success && response?.data) {
        setPostComments((prev) => ({
          ...prev,
          [postId]: Array.isArray(response.data) ? response.data : [],
        }));
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }
    const result = await createPost(newPost, token);
    if (result) {
      setNewPost('');
      fetchPosts();
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    const result = await deletePost(postId, token);
    if (result) {
      fetchPosts();
    }
  };

  const toggleLike = async (postId) => {
    const result = await toggleLikePost(postId, token);
    if (result) {
      fetchPosts();
    }
  };

  const toggleComments = async (postId) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      if (!postComments[postId]) {
        await fetchCommentsForPost(postId);
      }
    }
    setExpandedComments(newExpanded);
  };

  const handleAddComment = async (postId) => {
    const commentText = newCommentText[postId];
    if (!commentText || !commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    const result = await createComment(postId, commentText, token);
    if (result) {
      setNewCommentText((prev) => ({ ...prev, [postId]: '' }));
      await fetchCommentsForPost(postId);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    if (!window.confirm('Delete this comment?')) return;
    const result = await deleteComment(commentId, token);
    if (result) {
      await fetchCommentsForPost(postId);
    }
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Community Hub</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-600">
              <User size={20} />
              <span className="font-medium">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Share Your Thoughts</h2>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind? Share with the community..."
            className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="4"
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={handleCreatePost}
              disabled={!newPost.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-8 py-2 rounded-lg font-medium transition"
            >
              Post
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{post.authorName}</h3>
                      <p className="text-sm text-slate-500">
                        {new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.authorRole === 'admin' && (
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                          ADMIN
                        </span>
                      )}
                      {post.author === user?._id && (
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete post"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-b border-slate-200">
                  <p className="text-slate-700 leading-relaxed">{post.content}</p>
                </div>

                <div className="px-6 py-4 bg-slate-50 flex gap-6 border-b border-slate-200">
                  <button
                    onClick={() => toggleLike(post._id)}
                    className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition"
                  >
                    <Heart size={20} />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>

                  <button
                    onClick={() => toggleComments(post._id)}
                    className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition"
                  >
                    <MessageCircle size={20} />
                    <span className="text-sm font-medium">
                      {(postComments[post._id] || []).length + (post.adminReplies || []).length}
                    </span>
                  </button>

                  <button className="flex items-center gap-2 text-slate-600 hover:text-green-600 transition">
                    <Share2 size={20} />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>

                {expandedComments.has(post._id) && (
                  <div className="p-6 bg-slate-50">
                    <h4 className="font-bold text-slate-900 mb-4">Comments & Official Replies</h4>
                    <div className="space-y-4 mb-4">
                      {(post.adminReplies || []).map((reply) => (
                        <div key={reply._id} className="p-4 rounded-lg bg-blue-50 border-2 border-blue-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-bold text-slate-900">Admin</span>
                              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded ml-2">
                                Official Reply
                              </span>
                            </div>
                          </div>
                          <p className="text-slate-700">{reply.content}</p>
                        </div>
                      ))}

                      {(postComments[post._id] || []).map((comment) => (
                        <div key={comment._id} className="p-4 rounded-lg bg-white border border-slate-200">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-slate-900">{comment.authorName}</span>
                            {comment.author === user?._id && (
                              <button
                                onClick={() => handleDeleteComment(comment._id, post._id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                          <p className="text-slate-700">{comment.content}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCommentText[post._id] || ''}
                        onChange={(e) => setNewCommentText((prev) => ({ ...prev, [post._id]: e.target.value }))}
                        placeholder="Add a comment..."
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
