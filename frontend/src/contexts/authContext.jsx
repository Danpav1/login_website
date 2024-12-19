// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext({
  token: null,
  user: null,
  loading: true,
  login: async (credentials) => {},
  register: async (userData) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:10000/api/auth/login', credentials);
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
    } catch (error) {
      throw error; // Let the component handle the error
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:10000/api/auth/register', userData);
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
    } catch (error) {
      throw error; // Let the component handle the error
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

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
      setLoading(false);
    };

    fetchUser();
  }, [token]);

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
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

