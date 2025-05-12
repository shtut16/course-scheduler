// Navbar.js
// This component renders the main navigation bar for the application.
// It displays links to the Dashboard, Login, and Sign Up pages depending on the authentication status.

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', backgroundColor: '#007bff', color: 'white' }}>
      <Link to="/dashboard" style={{ marginRight: '10px', color: 'white', textDecoration: 'none' }}>Dashboard</Link>

      {token ? (
        <button onClick={handleLogout} style={{ color: '#007bff', backgroundColor: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer' }}>
          Logout
        </button>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: '10px', color: 'white', textDecoration: 'none' }}>Login</Link>
          <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
