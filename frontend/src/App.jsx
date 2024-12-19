// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Assuming you have a Footer
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage')); // Optional

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mx-auto p-4">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Home Page Route */}
              <Route path="/" element={<HomePage />} />

              {/* Login Route */}
              <Route path="/login" element={<LoginPage />} />

              {/* Register Route */}
              <Route path="/register" element={<RegisterPage />} />

              {/* Dashboard Route (Protected) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-All Route for Undefined Paths */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
        <Footer /> {/* Add Footer below the Routes */}
      </Router>
    </AuthProvider>
  );
}

export default App;
