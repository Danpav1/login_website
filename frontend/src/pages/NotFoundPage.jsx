// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-inherit">
    <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
    <h2 className="text-2xl font-semibold mb-2 text-gray-100">Page Not Found</h2>
    <p className="text-gray-100 mb-6">
      The page you are looking for does not exist.
    </p>
    <Link
      to="/"
      className="px-4 py-2 bg-sky-500 text-gray-100 rounded hover:bg-sky-600 transition"
    >
      Go to Home
    </Link>
  </div>
);

export default NotFoundPage;

