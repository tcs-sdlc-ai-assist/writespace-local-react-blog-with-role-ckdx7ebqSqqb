import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentSession } from '../utils/auth.js';
import { getAllPosts, deletePost } from '../utils/blogStorage.js';
import { canEditPost, canDeletePost } from '../utils/ownership.js';
import { getAvatar } from '../components/avatar.jsx';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';

export function BlogListPage() {
  const session = getCurrentSession();
  const [posts, setPosts] = useState(() => {
    const all = getAllPosts();
    return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  });

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Blogs</h1>
              <p className="mt-1 text-sm text-gray-600">
                Browse all posts from the community.
              </p>
            </div>
            {session && (
              <Link
                to="/blogs/new"
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
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
                Write Post
              </Link>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📝</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No posts yet
              </h2>
              <p className="text-gray-500 mb-6">
                Be the first to share something with the community!
              </p>
              {session && (
                <Link
                  to="/blogs/new"
                  className="inline-flex items-center px-6 py-3 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Write Your First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100 flex flex-col"
                >
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.content}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                      <div className="flex items-center space-x-2">
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

                    <div className="flex items-center justify-end space-x-2 border-t border-gray-100 pt-3">
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}