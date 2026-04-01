import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCurrentSession } from '../utils/auth.js';
import { getPostById, deletePost } from '../utils/blogStorage.js';
import { canEditPost, canDeletePost } from '../utils/ownership.js';
import { getAvatar } from '../components/avatar.jsx';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';

export function BlogReadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getCurrentSession();

  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }

    const found = getPostById(id);
    if (!found) {
      setNotFound(true);
      return;
    }

    setPost(found);
  }, [id]);

  function handleDelete() {
    if (!post) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${post.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    const result = deletePost(post.id, session);
    if (result.status === 'success') {
      navigate('/blogs', { replace: true });
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Post not found
            </h1>
            <p className="text-gray-500 mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center px-6 py-3 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Back to Blogs
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link
              to="/blogs"
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blogs
            </Link>
          </div>

          <article className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                {getAvatar(post.author === 'admin' ? 'admin' : 'viewer')}
                <div>
                  <span className="text-gray-900 font-medium text-sm">
                    {post.author}
                  </span>
                  <div className="text-xs text-gray-400">
                    Published on{' '}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <span className="text-xs text-gray-400">
                  Updated on{' '}
                  {new Date(post.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap text-sm leading-relaxed mb-8">
              {post.content}
            </div>

            {(canEditPost(post, session) || canDeletePost(post, session)) && (
              <div className="flex items-center justify-end space-x-3 border-t border-gray-100 pt-6">
                {canEditPost(post, session) && (
                  <Link
                    to={`/blogs/${post.id}/edit`}
                    className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-yellow-600 bg-yellow-50 hover:bg-yellow-100 transition-colors"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </Link>
                )}

                {canDeletePost(post, session) && (
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                )}
              </div>
            )}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}