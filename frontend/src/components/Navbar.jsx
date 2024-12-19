// src/components/Navbar.jsx
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';

const Navbar = () => {
  const { token, user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mapping of routes to page titles
  const routeTitles = {
    '/': 'Home',
    '/login': 'Login',
    '/register': 'Register',
    '/dashboard': 'Dashboard',
    // Add more routes and their titles as needed
  };

  // Determine the current page title
  const currentPageTitle = routeTitles[location.pathname] || 'Page';

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-indigo-600 text-white px-6 py-4">
      <div className="container mx-auto flex items-center justify-between relative">
        {/* Left Section: Logo */}
        <div className="flex-1">
          <Link to="/" className="text-xl font-bold">
            User Authentication App
          </Link>
        </div>

        {/* Center Section: Page Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold">
          {currentPageTitle} Page
        </div>

        {/* Right Section: Auth Links or Username Dropdown */}
        <div className="flex-1 flex justify-end space-x-4 items-center">
          {token ? (
            /* Username Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <span className="mr-2">{user?.name || 'User'}</span>
                {/* Dropdown Arrow Icon */}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-20">
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Login and Register Links */
            <>
              <Link
                to="/login"
                className="hover:bg-indigo-700 px-3 py-2 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:bg-indigo-700 px-3 py-2 rounded"
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
