import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentSession } from '../utils/auth.js';
import { getPostById, createPost, updatePost } from '../utils/blogStorage.js';
import { canEditPost } from '../utils/ownership.js';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';

export function BlogFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getCurrentSession();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    if (isEditing) {
      const post = getPostById(id);
      if (!post) {
        navigate('/blogs', { replace: true });
        return;
      }

      if (!canEditPost(post, session)) {
        navigate('/blogs', { replace: true });
        return;
      }

      setTitle(post.title);
      setContent(post.content);
    }
  }, [id, isEditing, navigate, session]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    if (!content.trim()) {
      setError('Content is required.');
      return;
    }

    if (title.trim().length > 100) {
      setError('Title must be at most 100 characters.');
      return;
    }

    if (content.trim().length > 1000) {
      setError('Content must be at most 1000 characters.');
      return;
    }

    if (isEditing) {
      const result = updatePost(id, { title: title.trim(), content: content.trim() }, session);
      if (result.status === 'error') {
        setError(result.message);
        return;
      }
    } else {
      const result = createPost({ title: title.trim(), content: content.trim() }, session);
      if (result.status === 'error') {
        setError(result.message);
        return;
      }
    }

    navigate('/blogs', { replace: true });
  }

  function handleCancel() {
    navigate('/blogs');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {isEditing ? 'Edit Post' : 'Write a New Post'}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {isEditing
                ? 'Update your post below.'
                : 'Share your thoughts with the community.'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your post title"
              />
              <p className="mt-1 text-xs text-gray-400">
                {title.length}/100 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <textarea
                id="content"
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Write your content here..."
              />
              <p className="mt-1 text-xs text-gray-400">
                {content.length}/1000 characters
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
              >
                {isEditing ? 'Update Post' : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}