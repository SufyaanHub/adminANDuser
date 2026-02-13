import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutGrid, Trash2, Shield, Users, FileText, Loader, MessageCircle, MoreVertical, Check } from 'lucide-react';
import { logout } from '../service/operations/authAPI';
import { deletePost } from '../service/operations/postAPI';
import { deleteComment } from '../service/operations/commentAPI';
import { postAdminReply, deleteAdminReply, getAllPostsForModeration } from '../service/operations/adminAPI';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminReplyModal, setAdminReplyModal] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    console.log('Admin Dashboard - User:', user, 'Token:', token?.substring(0, 20) + '...');
    
    if (!token) {
      console.log('No token, redirecting to login');
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'admin') {
      console.log('User role is not admin:', user?.role, 'User:', user);
      navigate('/unauthorized');
      return;
    }
    
    console.log('User is admin, fetching posts');
    fetchPostsForModeration();
  }, [token, user, navigate]);

  const fetchPostsForModeration = async () => {
    try {
      setLoading(true);
      console.log('Fetching posts for moderation...');
      console.log('User role from Redux:', user?.role);
      
      const response = await getAllPostsForModeration(1, 50, token);
      console.log('Response from getAllPostsForModeration:', response);
      
      if (response?.success) {
        console.log('Posts data:', response.data);
        setPosts(response.data || []);
        if (response.data?.length === 0) {
          toast.info('No posts to moderate');
        }
      } else {
        console.error('Response not successful:', response);
        const errorMsg = response?.message || 'Failed to load posts (check console for details)';
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Failed to fetch posts - Caught exception:', error);
      toast.error('Server error while fetching posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    const result = await deletePost(postId, token);
    if (result) {
      fetchPostsForModeration();
    }
  };

  const handleAddAdminReply = async (postId) => {
    if (!replyText.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    setSubmitLoading(true);
    console.log('Submitting admin reply:', { postId, content: replyText });
    
    const result = await postAdminReply(postId, replyText, token);
    
    console.log('Admin reply result:', result);
    setSubmitLoading(false);
    
    if (result && result.success) {
      setReplyText('');
      setAdminReplyModal(null);
      await fetchPostsForModeration();
      toast.success('Reply posted successfully!');
    } else {
      console.error('Admin reply failed:', result);
      toast.error('Failed to post reply');
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    if (!window.confirm('Delete this comment?')) return;
    const result = await deleteComment(commentId, token);
    if (result) {
      fetchPostsForModeration();
    }
  };

  const handleDeleteAdminReply = async (replyId, postId) => {
    if (!window.confirm('Delete this official reply?')) return;
    const result = await deleteAdminReply(replyId, token);
    if (result) {
      fetchPostsForModeration();
    }
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader className="animate-spin text-blue-400" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 sticky top-20">
              <h2 className="text-xl font-bold text-slate-100 mb-6">Navigation</h2>
              <nav className="space-y-3">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'posts'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <FileText size={20} />
                  Posts
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <LayoutGrid size={20} />
                  Dashboard
                </button>
              </nav>

              <div className="mt-8 pt-6 border-t border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <Shield size={20} className="text-blue-400" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <p className="text-sm text-slate-400">Administrator</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {/* Debug Panel */}
            <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="text-slate-300 text-sm space-y-1">
                <p><strong>User:</strong> {user?.name || 'Not loaded'} | <strong>Role:</strong> {user?.role || 'N/A'}</p>
                <p><strong>Posts Loaded:</strong> {posts.length} | <strong>Token:</strong> {token ? '✓ Present' : '✗ Missing'}</p>
              </div>
            </div>

            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-800 rounded-xl p-6">
                    <div className="text-slate-400 text-sm mb-2">Total Posts</div>
                    <div className="text-4xl font-bold text-blue-400">{posts.length}</div>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-6">
                    <div className="text-slate-400 text-sm mb-2">Total Comments</div>
                    <div className="text-4xl font-bold text-green-400">
                      {posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0)}
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-6">
                    <div className="text-slate-400 text-sm mb-2">Total Admin Replies</div>
                    <div className="text-4xl font-bold text-yellow-400">
                      {posts.reduce((sum, post) => sum + (post.adminReplies?.length || 0), 0)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'posts' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-slate-100">Manage Posts</h2>
                <div className="space-y-6">
                  {posts.length === 0 ? (
                    <div className="text-center py-16">
                      <MessageCircle className="mx-auto text-slate-400 mb-4" size={48} />
                      <p className="text-slate-400 text-lg">No posts to moderate</p>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <div key={post._id} className="bg-gradient-to-br from-slate-800 to-slate-850 rounded-2xl overflow-hidden shadow-xl border border-slate-700 hover:border-slate-600 transition-all duration-300">
                        {/* Post Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                              <span className="text-lg font-bold text-white">{post.authorName.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white">{post.authorName}</h3>
                              <p className="text-sm text-blue-100">{new Date(post.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                          >
                            <Trash2 size={16} />
                            Delete Post
                          </button>
                        </div>

                        {/* Post Content */}
                        <div className="px-8 py-6 border-b border-slate-700">
                          <p className="text-slate-200 leading-relaxed text-base">{post.content}</p>
                        </div>

                        {/* Post Stats */}
                        <div className="px-8 py-4 bg-slate-900/50 flex gap-8 border-b border-slate-700">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">❤️</span>
                            <span className="text-slate-300 font-medium">{post.likes} Likes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle size={20} className="text-slate-300" />
                            <span className="text-slate-300 font-medium">
                              {(post.comments?.length || 0) + (post.adminReplies?.length || 0)} Comments & Replies
                            </span>
                          </div>
                        </div>

                        {/* Comments Section */}
                        <div className="p-8">
                          <h4 className="font-bold text-slate-100 mb-6 text-lg flex items-center gap-2">
                            <MessageCircle size={20} className="text-blue-400" />
                            Comments & Official Replies
                          </h4>

                          <div className="space-y-4 mb-8">
                            {/* Admin Replies First */}
                            {(post.adminReplies || []).length > 0 && (
                              <div className="space-y-4">
                                <div className="text-sm font-semibold text-blue-300 uppercase tracking-wider">Official Replies</div>
                                {(post.adminReplies || []).map((reply) => (
                                  <div key={reply._id} className="bg-gradient-to-r from-blue-900/40 to-blue-800/20 rounded-xl p-5 border-2 border-blue-500/50 hover:border-blue-400/80 transition-all duration-200 group">
                                    <div className="flex justify-between items-start mb-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center border-2 border-blue-300">
                                          <Check size={20} className="text-white" />
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-100">Admin</span>
                                            <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                              Official
                                            </span>
                                          </div>
                                          <p className="text-xs text-slate-400 mt-1">{new Date(reply.createdAt).toLocaleString()}</p>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => handleDeleteAdminReply(reply._id, post._id)}
                                        className="text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                    </div>
                                    <p className="text-slate-200 leading-relaxed ml-12">{reply.content}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* User Comments */}
                            {(post.comments || []).length > 0 && (
                              <div className="space-y-4">
                                {(post.adminReplies || []).length > 0 && (
                                  <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider pt-4">User Comments</div>
                                )}
                                {(post.comments || []).map((comment) => (
                                  <div key={comment._id} className="bg-slate-700/50 rounded-xl p-5 border border-slate-600 hover:border-slate-500 hover:bg-slate-700/70 transition-all duration-200 group">
                                    <div className="flex justify-between items-start mb-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-500 flex items-center justify-center border border-slate-500">
                                          <span className="text-sm font-bold text-white">{comment.authorName.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div>
                                          <span className="font-bold text-slate-100 block">{comment.authorName}</span>
                                          <p className="text-xs text-slate-400 mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => handleDeleteComment(comment._id, post._id)}
                                        className="text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed ml-12">{comment.content}</p>
                                    <div className="flex items-center gap-3 mt-3">
                                      <span className="text-sm text-slate-400">❤️ {comment.likes || 0} Likes</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* No comments message */}
                            {(post.comments || []).length === 0 && (post.adminReplies || []).length === 0 && (
                              <div className="text-center py-8">
                                <MessageCircle className="mx-auto text-slate-500 mb-3" size={32} />
                                <p className="text-slate-400 text-sm">No comments yet</p>
                              </div>
                            )}
                          </div>

                          {/* Admin Reply Form */}
                          {adminReplyModal === post._id ? (
                            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 space-y-4">
                              <h5 className="font-semibold text-slate-100 flex items-center gap-2">
                                <Check size={18} className="text-blue-400" />
                                Write Official Reply
                              </h5>
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write an official admin response..."
                                className="w-full p-4 bg-slate-700/80 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-medium"
                                rows="4"
                              />
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleAddAdminReply(post._id)}
                                  disabled={submitLoading || !replyText.trim()}
                                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-500 disabled:to-slate-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200"
                                >
                                  <Check size={18} />
                                  {submitLoading ? 'Posting...' : 'Post Official Reply'}
                                </button>
                                <button
                                  onClick={() => {
                                    setAdminReplyModal(null);
                                    setReplyText('');
                                  }}
                                  className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setAdminReplyModal(post._id);
                                setReplyText('');
                              }}
                              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                            >
                              <Check size={18} />
                              Post Official Reply
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
