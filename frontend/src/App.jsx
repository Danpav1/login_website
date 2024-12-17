// frontend/src/App.jsx
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

// ProtectedRoute component to guard authenticated routes
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            {/* Default route redirects based on authentication status */}
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

            {/* Login Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Register Route */}
            <Route path="/register" element={<RegisterPage />} />

            {/* Dashboard Route */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

            {/* Catch-all Route for Undefined Paths */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

