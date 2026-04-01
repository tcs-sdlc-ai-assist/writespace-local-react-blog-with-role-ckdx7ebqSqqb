import { useState } from 'react';
import { getCurrentSession, getAllUsers, addUser, deleteUser } from '../utils/auth.js';
import { getAvatar } from '../components/avatar.jsx';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';

export function UserManagement() {
  const session = getCurrentSession();

  const [users, setUsers] = useState(() => getAllUsers());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleCreateUser(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    if (!role) {
      setError('Role is required.');
      return;
    }

    const result = addUser({
      username: username.trim(),
      password: password,
      role: role,
    });

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(`User "${username.trim()}" created successfully.`);
    setUsername('');
    setPassword('');
    setRole('viewer');
    setUsers(getAllUsers());
  }

  function handleDeleteUser(targetUsername) {
    if (targetUsername === 'admin') {
      setError('Cannot delete admin user.');
      setSuccess('');
      return;
    }

    if (session && targetUsername === session.username) {
      setError('You cannot delete your own account.');
      setSuccess('');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete user "${targetUsername}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setError('');
    setSuccess('');

    const result = deleteUser(targetUsername);
    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(`User "${targetUsername}" deleted successfully.`);
    setUsers(getAllUsers());
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              User Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Create and manage users for your blog platform.
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {success}
            </div>
          )}

          {/* Create User Form */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Create New User
            </h2>
            <form onSubmit={handleCreateUser}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor="new-username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    id="new-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter password"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role
                  </label>
                  <select
                    id="new-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                  >
                    <svg
                      className="h-4 w-4 mr-2 inline"
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
                    Create User
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Users List */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              All Users ({users.length})
            </h2>

            {users.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-100">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-gray-500">
                  Create your first user using the form above.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {users.map((user) => (
                        <tr
                          key={user.username}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              {getAvatar(user.role)}
                              <span className="text-sm font-medium text-gray-900">
                                {user.username}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.role === 'admin'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}
                            >
                              {user.role === 'admin' ? 'Admin' : 'Viewer'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {user.username === 'admin' ||
                            (session && user.username === session.username) ? (
                              <span className="text-xs text-gray-400">
                                {user.username === 'admin'
                                  ? 'Protected'
                                  : 'Current user'}
                              </span>
                            ) : (
                              <button
                                onClick={() => handleDeleteUser(user.username)}
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.username}
                      className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getAvatar(user.role)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.username}
                            </p>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.role === 'admin'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}
                            >
                              {user.role === 'admin' ? 'Admin' : 'Viewer'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mb-3">
                        Created:{' '}
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : '—'}
                      </div>

                      <div className="border-t border-gray-100 pt-3">
                        {user.username === 'admin' ||
                        (session && user.username === session.username) ? (
                          <span className="text-xs text-gray-400">
                            {user.username === 'admin'
                              ? 'Protected'
                              : 'Current user'}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(user.username)}
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
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}