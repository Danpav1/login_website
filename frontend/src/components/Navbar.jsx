// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { token, user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          MyApp
        </Link>
        <div className="flex space-x-4">
          {token ? (
            <>
             <Link
                to="/dashboard"
                className="hover:bg-blue-700 px-3 py-2 rounded"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="hover:bg-blue-700 px-3 py-2 rounded"
              >
                Logout
              </button>
               <span className="flex items-center">
                {user?.name || 'User'}
              </span>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:bg-blue-700 px-3 py-2 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:bg-blue-700 px-3 py-2 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

