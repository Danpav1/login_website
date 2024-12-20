import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';

// Font Awesome Imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Navbar = () => {
  const { token, user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    <nav className="bg-inherit text-white px-6 py-4">
      <div className="container mx-auto flex items-center justify-between relative">
        {/* Left Section: Logo */}
        <div className="flex-1">
          <Link to="/" className="text-xl font-semibold text-slate-100 hover:text-sky-500">
            User Authentication App
          </Link>
        </div>

        {/* Right Section: Auth Links / Username Dropdown + Divider + GitHub Icon */}
        <div className="flex-1 flex justify-end items-center space-x-4 text-slate-100">
          {token ? (
            /* Username Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none hover:text-sky-500"
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
                <div className="absolute right-0 mt-2 w-26 bg-inherit text-gray-100 rounded-md shadow-lg z-20 outline outline-indigo-900">
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:text-sky-500 hover:rounded-md"
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
                className="hover:text-sky-500 px-3 py-2 rounded text-slate-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-sky-500 px-3 py-2 rounded text-slate-100"
              >
                Register
              </Link>
            </>
          )}

          {/* Vertical Divider */}
          <div className="border-l border-gray-500 h-6"></div>

          {/* GitHub Icon Link */}
          <a
            href="https://github.com/Danpav1/login_website"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 bg-inherit text-gray-800 p-2 rounded-full group"
          >
            <FontAwesomeIcon icon={faGithub} className="text-xl text-slate-100 group-hover:text-sky-500"/>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
