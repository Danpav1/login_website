// src/contexts/authContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set Axios defaults
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000/api/auth';
  axios.defaults.headers.post['Content-Type'] = 'application/json';

  // Fetch user data on component mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          console.log('Fetching user with token:', token);
          const response = await axios.get('/dashboard', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user);
          console.log('User fetched successfully:', response.data.user);
        } catch (error) {
          console.error('Error fetching user:', error.response);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // Login function
  const login = async ({ email, password }) => {
    try {
      console.log('Logging in with:', { email, password });
      const response = await axios.post('/login', { email, password });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      console.log('Login successful:', user);
    } catch (error) {
      console.error('Login error:', error.response);
      throw error;
    }
  };

  // Register function
  const register = async ({ name, email, password }) => {
    try {
      console.log('Registering with:', { name, email, password });
      const response = await axios.post('/register', { name, email, password });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      console.log('Registration successful:', user);
    } catch (error) {
      console.error('Registration error:', error.response);
      throw error;
    }
  };

  // Forgot Password function
  const forgotPassword = async ({ email }) => {
    try {
      console.log('Sending reset OTP for email:', email);
      const response = await axios.post('/forgot-password', { email });
      console.log('Forgot Password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Forgot Password API error:', error.response);
      throw error;
    }
  };

  // Reset Password function
  const resetPassword = async ({ email, otp, newPassword }) => {
    try {
      console.log('Resetting password with:', { email, otp, newPassword });
      const response = await axios.post('/reset-password', { email, otp, newPassword });
      console.log('Reset Password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Reset Password API error:', error.response);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    console.log('Logging out user:', user);
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
