import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getCurrentSession, logout } from '../utils/auth.js';
import { getAvatar } from './avatar.jsx';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const session = getCurrentSession();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setMobileOpen(false);
    navigate('/');
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-700 text-white'
        : 'text-gray-300 hover:bg-indigo-500 hover:text-white'
    }`;

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-white text-xl font-bold tracking-wide"
              onClick={closeMobile}
            >
              ✍️ WriteSpace
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <NavLink to="/" end className={linkClass} onClick={closeMobile}>
              Home
            </NavLink>

            {session && (
              <NavLink to="/blogs" className={linkClass} onClick={closeMobile}>
                Blogs
              </NavLink>
            )}

            {session && session.role === 'admin' && (
              <NavLink to="/admin" className={linkClass} onClick={closeMobile}>
                Dashboard
              </NavLink>
            )}

            {!session && (
              <>
                <NavLink to="/login" className={linkClass} onClick={closeMobile}>
                  Login
                </NavLink>
                <Link
                  to="/register"
                  className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-white text-indigo-600 hover:bg-gray-100 transition-colors"
                  onClick={closeMobile}
                >
                  Get Started
                </Link>
              </>
            )}

            {session && (
              <div className="flex items-center space-x-3 ml-4">
                <div className="flex items-center space-x-2">
                  {getAvatar(session.role)}
                  <span className="text-white text-sm font-medium">
                    {session.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-indigo-500 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-indigo-500 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden bg-indigo-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/" end className={linkClass} onClick={closeMobile}>
              Home
            </NavLink>

            {session && (
              <NavLink to="/blogs" className={linkClass} onClick={closeMobile}>
                Blogs
              </NavLink>
            )}

            {session && session.role === 'admin' && (
              <NavLink to="/admin" className={linkClass} onClick={closeMobile}>
                Dashboard
              </NavLink>
            )}

            {!session && (
              <>
                <NavLink to="/login" className={linkClass} onClick={closeMobile}>
                  Login
                </NavLink>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-sm font-medium bg-white text-indigo-600 hover:bg-gray-100 transition-colors text-center"
                  onClick={closeMobile}
                >
                  Get Started
                </Link>
              </>
            )}

            {session && (
              <div className="border-t border-indigo-500 pt-3 mt-2">
                <div className="flex items-center space-x-2 px-3 pb-2">
                  {getAvatar(session.role)}
                  <span className="text-white text-sm font-medium">
                    {session.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-indigo-500 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}