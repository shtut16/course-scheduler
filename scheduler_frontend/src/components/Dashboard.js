// Dashboard.js
// This component is responsible for rendering the dashboard UI.
// It fetches user-specific data from the backend API, such as the user's schedule, shared calendars,
// and additional management options for admin users. Based on the fetched data, it
// conditionally renders the dashboard content.

import React, { useEffect, useState } from 'react';
import axios from "./helper/axiosInstance";
import { Link } from "react-router-dom";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const accessToken = localStorage.getItem('access_token');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/dashboard/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setUserData({ error: 'Error fetching dashboard data' });
      }
    };

    fetchDashboardData();
  }, [apiUrl, accessToken]);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Dashboard</h1>
        <p style={{ color: '#555', marginBottom: '30px' }}>
          View your schedule, access shared calendars, and manage your courses.
        </p>

        {userData ? (
          userData.error ? (
            <p style={{ color: 'red' }}>{userData.error}</p>
          ) : (
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              padding: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <h2 style={{ marginBottom: '20px' }}>{userData.message}</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <Link to="/shared-cal" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '12px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}>
                    View Shared Calendar
                  </button>
                </Link>

                {userData.is_staff && (
                  <a href={`${apiUrl}/admin/`} target="_blank" rel="noopener noreferrer">
                    <button style={{
                      padding: '12px 20px',
                      backgroundColor: '#343a40',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}>
                      Go to Django Admin Panel
                    </button>
                  </a>
                )}
              </div>
            </div>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
