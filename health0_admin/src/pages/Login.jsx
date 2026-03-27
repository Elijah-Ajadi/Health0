import React, { useState } from 'react';
import api from '../api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/login/', { username, password });
            const { token, user } = res.data;

            if (user.role === 'ADMIN' || user.is_staff_admin || user.is_superuser) {
                localStorage.setItem('admin_token', token);
                localStorage.setItem('admin_role', user.role);
                window.location.reload();
            } else {
                setError('Access Denied: Only administrators can access this portal.');
            }
        } catch (err) {
            setError('Invalid credentials or connection error.');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh', background: '#f8fafc' }}>
            <div className="stat-card" style={{ width: '400px', padding: '2.5rem' }}>
                <h1 className="logo-text" style={{ textAlign: 'center', marginBottom: '2rem' }}>Health<span>0</span> Admin</h1>
                {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="stat-label">Username or NIN</label>
                        <input
                            type="text"
                            className="btn btn-secondary"
                            style={{ width: '100%', marginTop: '0.5rem', textAlign: 'left', cursor: 'text' }}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label className="stat-label">Password</label>
                        <input
                            type="password"
                            className="btn btn-secondary"
                            style={{ width: '100%', marginTop: '0.5rem', textAlign: 'left', cursor: 'text' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Login to Dashboard</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
