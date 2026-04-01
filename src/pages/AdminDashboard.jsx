import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentSession, getAllUsers } from '../utils/auth.js';
import { getAllPosts, deletePost } from '../utils/blogStorage.js';
import { canEditPost, canDeletePost } from '../utils/ownership.js';
import { getAvatar } from '../components/avatar.jsx';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';

export function AdminDashboard() {
  const session = getCurrentSession();
  const navigate = useNavigate();

  const [posts, setPosts] = useState(() => {
    const all = getAllPosts();
    return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  });

  const users = getAllUsers();
  const totalPosts = posts.length;
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const viewerCount = users.filter((u) => u.role === 'viewer').length;

  const recentPosts = posts.slice(0, 5);

  function handleDelete(postId) {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${post.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    const result = deletePost(postId, session);
    if (result.status === 'success') {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  }

  const stats = [
    {
      label: 'Total Posts',
      value: totalPosts,
      emoji: '📝',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: 'Total Users',
      value: totalUsers,
      emoji: '👥',
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Admins',
      value: adminCount,
      emoji: '👑',
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      label: 'Viewers',
      value: viewerCount,
      emoji: '📖',
      color: 'bg-pink-50 text-pink-600',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, {session ? session.username : 'Admin'}! Here's an
              overview of your blog.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${stat.color}`}
                  >
                    <span className="text-2xl">{stat.emoji}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/blogs/new"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Write New Post
              </Link>
              <Link
                to="/admin/users"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-medium text-indigo-600 bg-white border border-indigo-300 hover:bg-indigo-50 transition-colors shadow-sm"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Manage Users
              </Link>
              <Link
                to="/blogs"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-medium text-indigo-600 bg-white border border-indigo-300 hover:bg-indigo-50 transition-colors shadow-sm"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                View All Posts
              </Link>
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recent Posts
            </h2>

            {recentPosts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-100">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Get started by writing your first post!
                </p>
                <Link
                  to="/blogs/new"
                  className="inline-flex items-center px-6 py-3 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Write Your First Post
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-grow min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                            {post.content}
                          </p>
                          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-400">
                            <div className="flex items-center space-x-1">
                              {getAvatar(
                                post.author === 'admin' ? 'admin' : 'viewer'
                              )}
                              <span className="text-gray-600 font-medium">
                                {post.author}
                              </span>
                            </div>
                            <span>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Link
                            to={`/blogs/${post.id}`}
                            className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            Read
                          </Link>

                          {canEditPost(post, session) && (
                            <Link
                              to={`/blogs/${post.id}/edit`}
                              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-yellow-600 hover:bg-yellow-50 transition-colors"
                            >
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </Link>
                          )}

                          {canDeletePost(post, session) && (
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {posts.length > 5 && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
                    <Link
                      to="/blogs"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                      View all {posts.length} posts →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}