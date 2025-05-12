// Signup.js
// Handles user signup functionality, collects username, email,and password, and sends them to the API for
// account creation. Displays any error messages if signup fails. Upon successful signup,
// the user is redirected to the login page.

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';  // Reusing the Login CSS
import { Tooltip } from 'react-tooltip';

const apiUrl = process.env.REACT_APP_API_URL;
const Signup = () => {
    // State variables for storing form data and error messages
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // navigate hook for redirecting after successful signup
    const navigate = useNavigate();

    // handleSubmit function that handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${apiUrl}/api/signup/`, {
                username,
                email,
                password,
            });

            // If signup is successful, redirect to login page
            if (response.status === 201) {
                alert('Signup successful! Please log in.');
                navigate('/login');
            }

        // If signup fails, display an error message
        } catch (error) {
            setError('Signup failed. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h1 className="login-title">Sign Up</h1>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            data-tooltip-id="username-tip"
                            data-tooltip-content="Pick a unique username you'll remember"
                        />
                        <Tooltip id="username-tip" className="react-tooltip" place="right" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            data-tooltip-id="email-tip"
                            data-tooltip-content="Enter a valid email address"
                        />
                        <Tooltip id="email-tip" className="react-tooltip" place="right" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            data-tooltip-id="password-tip"
                            data-tooltip-content="Choose a strong password (at least 8 characters)"
                        />
                        <Tooltip id="password-tip" className="react-tooltip" place="right" />
                    </div>
                    <buttons
                        type="submit"
                        className="login-button"
                        data-tooltip-id="signup-tip"
                        data-tooltip-content="Click to create your new account"
                    >
                        Sign Up
                    </buttons>
                    <Tooltip id="signup-tip" className="react-tooltip" place="top" />
                </form>
            </div>
        </div>
    );
};

export default Signup;
