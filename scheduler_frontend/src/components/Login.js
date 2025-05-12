// Login.js
// This component handles the user login functionality.
// It takes the user's username and password as inputs, attempts to authenticate the user via an API request,
// and stores the received tokens in localStorage if successful.

import React, { useState } from "react";
import axios from 'axios';
import '../styles/Login.css';
import { Tooltip } from 'react-tooltip';

function Login() {
  // State hooks for managing the username, password, and error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

   // API URL from environment variables
  const apiUrl = process.env.REACT_APP_API_URL;

  // handleLogin function to authenticate the user
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sending a POST request to the API for authentication
      const response = await axios.post(`${apiUrl}/api/login/`, {
        username,
        password,
      });

      // Storing the access and refresh tokens in localStorage
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);

      // Redirecting the user to the dashboard upon successful login
      window.location.href = '/dashboard';
    } catch (error) {
      setErrorMessage('Invalid username or password');
    }
  };

  return (
      <div className="login-container">
          <div className="login-form">
            <h1 className="login-title">Login</h1>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                    data-tooltip-id="username-tooltip"
                    data-tooltip-content="Enter the username you used to sign up"
                />
                <Tooltip id="username-tooltip" className="react-tooltip" place="right"/>
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    data-tooltip-id="password-tooltip"
                    data-tooltip-content="Enter your account password"
                />
                <Tooltip id="password-tooltip" className="react-tooltip" place="right"/>
              </div>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <button
                  type="submit"
                  className="login-button"
                  data-tooltip-id="login-button-tooltip"
                  data-tooltip-content="Click to log in to your account"
              >
                Login
              </button>
              <Tooltip id="login-button-tooltip" className="react-tooltip" place="top"/>
            </form>
          </div>
      </div>
);
}

export default Login;
