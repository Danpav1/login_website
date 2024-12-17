// frontend/src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { token, user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/" className="text-white font-bold text-xl">
            MyProject
          </Link>
        </div>
        <div className="flex items-center">
          {token ? (
            <>
              <Link to="/dashboard" className="text-white mr-4 hover:text-gray-300">
                Dashboard
              </Link>
              {user && (
                <span className="text-white mr-4">
                  {user.name}
                </span>
              )}
              <button onClick={handleLogout} className="text-white hover:text-gray-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white mr-4 hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

