import axios from 'axios';

// Base URL for authentication-related API endpoints
const API_URL = 'http://localhost:10000/api/auth';

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    // Extract error message from response
    throw error.response.data;
  }
};

// Login User
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    // Extract error message from response
    throw error.response.data;
  }
};

