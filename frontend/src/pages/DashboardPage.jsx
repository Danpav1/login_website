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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">{message || 'Loading...'}</h2>
        {/* Optionally, add more dashboard content here */}
      </div>
    </div>
  );
}

export default DashboardPage;

