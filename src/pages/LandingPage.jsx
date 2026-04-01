import { Link } from 'react-router-dom';
import { getCurrentSession } from '../utils/auth.js';
import { getLatestPosts } from '../utils/blogStorage.js';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';

export function LandingPage() {
  const session = getCurrentSession();
  const latestPosts = getLatestPosts(3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Welcome to WriteSpace
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
              A clean, simple space to share your thoughts, stories, and ideas with the world. Start writing today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!session && (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-3 rounded-md text-lg font-semibold bg-white text-indigo-600 hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-3 rounded-md text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-indigo-600 transition-colors"
                  >
                    Login
                  </Link>
                </>
              )}
              {session && session.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-8 py-3 rounded-md text-lg font-semibold bg-white text-indigo-600 hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Go to Dashboard
                </Link>
              )}
              {session && session.role === 'viewer' && (
                <Link
                  to="/blogs"
                  className="px-8 py-3 rounded-md text-lg font-semibold bg-white text-indigo-600 hover:bg-gray-100 transition-colors shadow-lg"
                >
                  My Blogs
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why WriteSpace?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">✍️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Easy Writing
                </h3>
                <p className="text-gray-600">
                  A distraction-free editor that lets you focus on what matters most — your words.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Role-Based Access
                </h3>
                <p className="text-gray-600">
                  Admins manage everything. Viewers read and explore. Simple, secure, and organized.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Instant Publishing
                </h3>
                <p className="text-gray-600">
                  Write, publish, and share your posts instantly. No setup, no hassle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Posts Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Latest Posts
            </h2>
            {latestPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No posts yet. Be the first to share something!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>By {post.author}</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}