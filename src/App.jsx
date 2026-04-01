import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { BlogListPage } from './pages/BlogListPage.jsx';
import { BlogFormPage } from './pages/BlogFormPage.jsx';
import { BlogReadPage } from './pages/BlogReadPage.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { UserManagement } from './pages/UserManagement.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <BlogListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/new"
          element={
            <ProtectedRoute>
              <BlogFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/:id/edit"
          element={
            <ProtectedRoute>
              <BlogFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <ProtectedRoute>
              <BlogReadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <UserManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}