import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';

const HomePage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // If authenticated, redirect to Dashboard
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-inherit px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-100">Welcome to my User Authentication App</h1>
      <p className="text-lg mb-6 text-center text-gray-100">
        Please login or register to continue.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/login"
          className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
