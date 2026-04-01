import { Navigate } from 'react-router-dom';
import { getCurrentSession } from '../utils/auth.js';

export function ProtectedRoute({ children, requiredRole }) {
  const session = getCurrentSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && session.role !== requiredRole) {
    return <Navigate to="/blogs" replace />;
  }

  return children;
}