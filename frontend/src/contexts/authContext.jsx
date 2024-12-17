// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext with default values
export const AuthContext = createContext({
  token: null,
  user: null,
  login: (token, user) => {},
  logout: () => {},
});

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // Function to handle login
  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
  };

  // Function to handle logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  // Fetch user data when token changes
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:10000/api/auth/dashboard', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
          logout();
        }
      }
    };

    fetchUser();
  }, [token]);

  // Listen to storage changes (for multi-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'token') {
        const newToken = event.newValue;
        setToken(newToken);
        if (!newToken) {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

