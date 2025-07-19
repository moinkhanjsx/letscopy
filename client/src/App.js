import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Lazy load components for code splitting
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const CreatePost = lazy(() => import('./components/CreatePost'));
const EditPost = lazy(() => import('./components/EditPost'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Main App Component
const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container py-8">
        <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
          <Routes>
            <Route path="/" element={
              user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            } />
            <Route path="/login" element={
              user ? <Navigate to="/dashboard" /> : <Login />
            } />
            <Route path="/register" element={
              user ? <Navigate to="/dashboard" /> : <Register />
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/create" element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            } />
            <Route path="/edit/:id" element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

// App with Auth Provider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App; 