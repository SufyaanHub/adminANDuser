import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">NewWay</h1>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-slate-600">Welcome, {user?.name}!</span>
                  {user?.role === 'admin' ? (
                    <button
                      onClick={() => navigate('/admin/dashboard')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Admin Dashboard
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/dashboard/my-profile')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      My Dashboard
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Welcome to NewWay
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 mb-8">
            Your platform for learning and admin management
          </p>
          {!isAuthenticated && (
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-slate-200 hover:bg-slate-300 text-slate-900 px-8 py-3 rounded-lg font-semibold transition"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">User Account</h3>
            <p className="text-slate-600">Create your account and start learning with our comprehensive courses.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">👨‍💼</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Admin Dashboard</h3>
            <p className="text-slate-600">Manage courses, users, and content from a powerful admin panel.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Secure & Safe</h3>
            <p className="text-slate-600">Your data is protected with industry-standard security measures.</p>
          </div>
        </div>

        {/* Call to Action */}
        {isAuthenticated && (
          <div className="mt-20 bg-blue-600 text-white p-12 rounded-xl text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to explore?</h3>
            <p className="text-lg mb-6">
              {user?.role === 'admin'
                ? 'Access your admin tools and manage the platform.'
                : 'Start your learning journey with thousands of courses.'}
            </p>
            <button
              onClick={() =>
                user?.role === 'admin'
                  ? navigate('/admin/dashboard')
                  : navigate('/dashboard/my-profile')
              }
              className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-3 rounded-lg font-semibold transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 NewWay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
