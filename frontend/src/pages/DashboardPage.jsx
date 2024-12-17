// frontend/src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');
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
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        navigate('/login');
      }
    };

    fetchDashboard();
  }, [navigate]);

  return (
    <div className="text-center mt-20">
      <h2 className="text-3xl font-bold mb-4">{message || 'Loading...'}</h2>
      <p className="text-gray-700">Welcome to your dashboard.</p>
    </div>
  );
}

export default DashboardPage;

