import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Heart, MessageCircle, Share2 } from 'lucide-react';
import { logout } from '../service/operations/authAPI';

const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Admin',
      role: 'admin',
      content: 'Welcome to our community platform! Feel free to share your thoughts and engage with other members.',
      date: '2 hours ago',
      likes: 45,
      comments: [
        { id: 1, author: 'John', content: 'Great initiative!', isAdmin: false },
        { id: 2, author: 'Admin', content: 'Thank you for your support!', isAdmin: true }
      ]
    },
    {
      id: 2,
      author: 'Sarah',
      role: 'user',
      content: 'Just started learning React and loving it so far! Any tips for beginners?',
      date: '4 hours ago',
      likes: 28,
      comments: [
        { id: 3, author: 'Mike', content: 'Check out the official React docs!' }
      ]
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [expandedComments, setExpandedComments] = useState(new Set());

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post = {
      id: posts.length + 1,
      author: user?.name || 'You',
      role: user?.role || 'user',
      content: newPost,
      date: 'just now',
      likes: 0,
      comments: []
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const toggleLike = (postId) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
  };

  const toggleComments = (postId) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Create Post Section */}
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

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              {/* Post Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{post.author}</h3>
                    <p className="text-sm text-slate-500">{post.date}</p>
                  </div>
                  {post.role === 'admin' && (
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                      ADMIN
                    </span>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6 border-b border-slate-200">
                <p className="text-slate-700 leading-relaxed">{post.content}</p>
              </div>

              {/* Post Actions */}
              <div className="px-6 py-4 bg-slate-50 flex gap-6 border-b border-slate-200">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 transition ${
                    likedPosts.has(post.id)
                      ? 'text-red-600'
                      : 'text-slate-600 hover:text-red-600'
                  }`}
                >
                  <Heart
                    size={20}
                    fill={likedPosts.has(post.id) ? 'currentColor' : 'none'}
                  />
                  <span className="text-sm font-medium">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                </button>

                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition"
                >
                  <MessageCircle size={20} />
                  <span className="text-sm font-medium">{post.comments.length}</span>
                </button>

                <button className="flex items-center gap-2 text-slate-600 hover:text-green-600 transition">
                  <Share2 size={20} />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>

              {/* Comments Section */}
              {expandedComments.has(post.id) && (
                <div className="p-6 bg-slate-50">
                  <h4 className="font-bold text-slate-900 mb-4">Comments</h4>
                  <div className="space-y-4 mb-4">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`p-4 rounded-lg ${
                          comment.isAdmin
                            ? 'bg-blue-50 border-2 border-blue-200'
                            : 'bg-white border border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-slate-900">{comment.author}</span>
                          {comment.isAdmin && (
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                              Official Reply
                            </span>
                          )}
                        </div>
                        <p className="text-slate-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Comment Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
                      Comment
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
