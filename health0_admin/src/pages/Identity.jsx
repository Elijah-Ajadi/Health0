import React, { useState, useEffect } from 'react';
import api from '../api';
import { Fingerprint, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

const Identity = () => {
    const [logs, setLogs] = useState([]);
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [logRes, analyticsRes] = await Promise.all([
            api.get('/admin/verification/logs/'),
            api.get('/admin/verification/analytics/')
        ]);
        setLogs(logRes.data);
        setAnalytics(analyticsRes.data);
    };

    return (
        <div className="main-content">
            <header className="page-header">
                <h1 className="page-title">Identity & Verification Oversight</h1>
                <p className="page-subtitle">Monitor real-time NIN/VNIN verification traffic and KYC health.</p>
            </header>

            {analytics && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">API Credits Remaining</div>
                        <div className="stat-value" style={{ color: analytics.api_credits_remaining < 100 ? 'var(--danger)' : 'var(--success)' }}>
                            {analytics.api_credits_remaining}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Verifications</div>
                        <div className="stat-value">{analytics.total_verifications}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">System Success Rate</div>
                        <div className="stat-value">{analytics.success_rate}%</div>
                    </div>
                </div>
            )}

            <div className="table-container">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                    <h3>Verification Logs (Real-time Stream)</h3>
                    <button className="btn btn-secondary" onClick={fetchData}>Refresh</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>User</th>
                            <th>NIN/VNIN Queried</th>
                            <th>Status</th>
                            <th>IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id}>
                                <td style={{ color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                                <td>{log.user_name || 'System'}</td>
                                <td><code style={{ background: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{log.nin_queried}</code></td>
                                <td>
                                    <span className={`badge badge-${log.status === 'SUCCESS' ? 'active' : 'danger'}`}>
                                        {log.status === 'SUCCESS' ? <CheckCircle size={12} style={{ marginRight: '4px' }} /> : <AlertTriangle size={12} style={{ marginRight: '4px' }} />}
                                        {log.status}
                                    </span>
                                </td>
                                <td>{log.ip_address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Identity;
