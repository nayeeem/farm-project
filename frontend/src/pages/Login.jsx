import React, { useState } from 'react';
import './Login.css';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(username, password);
        if (!success) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Farm Manager</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                            placeholder="Enter your username"
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
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">
                        Sign In
                    </button>
                </form>
                <div className="register-link">
                    Don't have an account? <Link to="/register">Create user</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
