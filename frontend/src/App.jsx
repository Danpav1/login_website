// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          {/* Default route redirects based on authentication status */}
          <Route path="/" element={token ? <DashboardPage /> : <Navigate to="/login" />} />

          {/* Login Route */}
          <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />

          {/* Register Route */}
          <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/" />} />

          {/* Dashboard Route */}
          <Route path="/dashboard" element={token ? <DashboardPage /> : <Navigate to="/login" />} />

          {/* Catch-all Route for Undefined Paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

