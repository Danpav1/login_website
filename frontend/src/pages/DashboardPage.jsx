import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import LoadingSpinner from '../components/LoadingSpinner'; // Adjust this path if needed

function DashboardPage() {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:10000/api/auth/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage(response.data.message);
        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard. Please try logging in again.');
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-inherit">
        <LoadingSpinner /> 
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-inherit">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-inherit">
      <div className="p-6 bg-inherit rounded shadow-2xl outline outline-indigo-900 text-center">
        <h2 className="text-2xl font-bold mb-4 text-slate-100">{message}</h2>
        <p className="text-lg text-gray-100">
          You have logged in as <span className="font-semibold text-slate-200">{user.name}</span> - <span className="font-semibold text-slate-200">{user.email}</span>
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;
