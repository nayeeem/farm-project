import React, { useState } from 'react';
import './Register.css';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await api.post('/users/register', { username, password });
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (error) {
            console.error("Registration failed", error);
            setError(error.response?.data?.detail || "Registration failed");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Create Account</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="Choose a password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-input"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">
                        Register
                    </button>
                </form>
                <div className="register-link">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
