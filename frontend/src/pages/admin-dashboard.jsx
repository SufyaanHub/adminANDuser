import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutGrid, Trash2, Shield, Users, FileText } from 'lucide-react';
import { logout } from '../service/operations/authAPI';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Sarah',
      content: 'Just started learning React and loving it so far! Any tips for beginners?',
      date: '4 hours ago',
      likes: 28,
      comments: [
        { id: 3, author: 'Mike', content: 'Check out the official React docs!', isAdmin: false }
      ]
    },
    {
      id: 2,
      author: 'John',
      content: 'Looking for project collaboration opportunities in web development.',
      date: '2 days ago',
      likes: 15,
      comments: []
    }
  ]);

  const [adminReplyModal, setAdminReplyModal] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.id !== postId));
    }
  };

  const handleAddAdminReply = (postId) => {
    if (!replyText.trim()) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: post.comments.length + 1,
              author: 'Admin',
              content: replyText,
              isAdmin: true
            }
          ]
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    setReplyText('');
    setAdminReplyModal(null);
  };

  const handleDeleteComment = (postId, commentId) => {
    if (window.confirm('Delete this comment?')) {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.filter(c => c.id !== commentId)
          };
        }
        return post;
      });
      setPosts(updatedPosts);
    }
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Top Navigation */}
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
          {/* Sidebar */}
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
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'users'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Users size={20} />
                  Users
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

              {/* Admin Info */}
              <div className="mt-8 pt-6 border-t border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <Shield size={20} className="text-blue-400" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <p className="text-sm text-slate-400">Administrator</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-800 rounded-xl p-6">
                    <div className="text-slate-400 text-sm mb-2">Total Posts</div>
                    <div className="text-4xl font-bold text-blue-400">{posts.length}</div>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-6">
                    <div className="text-slate-400 text-sm mb-2">Total Users</div>
                    <div className="text-4xl font-bold text-green-400">245</div>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-6">
                    <div className="text-slate-400 text-sm mb-2">Active Sessions</div>
                    <div className="text-4xl font-bold text-yellow-400">42</div>
                  </div>
                </div>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Manage Posts</h2>
                <div className="space-y-6">
                  {posts.map((post) => (
                    <div key={post.id} className="bg-slate-800 rounded-xl overflow-hidden">
                      {/* Post Header */}
                      <div className="p-6 border-b border-slate-700 flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-100">{post.author}</h3>
                          <p className="text-sm text-slate-400">{post.date}</p>
                        </div>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>

                      {/* Post Content */}
                      <div className="p-6 border-b border-slate-700">
                        <p className="text-slate-300 leading-relaxed">{post.content}</p>
                      </div>

                      {/* Post Stats */}
                      <div className="px-6 py-4 bg-slate-900 flex gap-6 border-b border-slate-700">
                        <span className="text-slate-400 text-sm">❤️ {post.likes} Likes</span>
                        <span className="text-slate-400 text-sm">💬 {post.comments.length} Comments</span>
                      </div>

                      {/* Comments */}
                      <div className="p-6">
                        <h4 className="font-bold text-slate-100 mb-4">Comments ({post.comments.length})</h4>
                        <div className="space-y-4 mb-4">
                          {post.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className={`p-4 rounded-lg flex justify-between items-start ${
                                comment.isAdmin
                                  ? 'bg-blue-900 border-2 border-blue-500'
                                  : 'bg-slate-700'
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-bold text-slate-100">{comment.author}</span>
                                  {comment.isAdmin && (
                                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                                      Official Reply
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-300">{comment.content}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteComment(post.id, comment.id)}
                                className="text-red-400 hover:text-red-300 transition"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Admin Reply */}
                        {adminReplyModal === post.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write an official admin reply..."
                              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows="3"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAddAdminReply(post.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                              >
                                Post Official Reply
                              </button>
                              <button
                                onClick={() => setAdminReplyModal(null)}
                                className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-4 py-2 rounded-lg font-medium transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAdminReplyModal(post.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                          >
                            Write Official Reply
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
                <div className="bg-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-900">
                      <tr>
                        <th className="px-6 py-4 text-left text-slate-100 font-bold">Name</th>
                        <th className="px-6 py-4 text-left text-slate-100 font-bold">Email</th>
                        <th className="px-6 py-4 text-left text-slate-100 font-bold">Role</th>
                        <th className="px-6 py-4 text-left text-slate-100 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Sarah', email: 'sarah@example.com', role: 'user', status: 'Active' },
                        { name: 'John', email: 'john@example.com', role: 'user', status: 'Active' },
                        { name: 'Mike', email: 'mike@example.com', role: 'user', status: 'Active' },
                      ].map((userItem, idx) => (
                        <tr key={idx} className="border-t border-slate-700 hover:bg-slate-700 transition">
                          <td className="px-6 py-4 text-slate-100">{userItem.name}</td>
                          <td className="px-6 py-4 text-slate-100">{userItem.email}</td>
                          <td className="px-6 py-4">
                            <span className="bg-blue-900 text-blue-200 text-xs font-bold px-3 py-1 rounded">
                              {userItem.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-green-900 text-green-200 text-xs font-bold px-3 py-1 rounded">
                              {userItem.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
