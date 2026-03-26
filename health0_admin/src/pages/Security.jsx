import React, { useState, useEffect } from 'react';
import api from '../api';
import { ShieldAlert, History, UserCheck, Shield } from 'lucide-react';

const Security = () => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [auditRes, alertRes] = await Promise.all([
            api.get('/admin/audit/trail/'),
            api.get('/admin/security/alerts/')
        ]);
        setAuditLogs(auditRes.data);
        setAlerts(alertRes.data);
    };

    return (
        <div className="main-content">
            <header className="page-header">
                <h1 className="page-title">Security, Audit & Compliance</h1>
                <p className="page-subtitle">Platform-wide activity ledger and automated breach detection.</p>
            </header>

            <div className="grid-2">
                <div className="table-container">
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: '#fef2f2' }}>
                        <h3 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShieldAlert size={20} /> Active Security Alerts
                        </h3>
                    </div>
                    <div style={{ padding: '1rem' }}>
                        {alerts.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No active threats detected.</p>
                        ) : (
                            alerts.map(alert => (
                                <div key={alert.id} className="stat-card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--danger)' }}>
                                    <p><strong>{alert.severity}</strong>: {alert.message}</p>
                                    <small style={{ color: 'var(--text-muted)' }}>{new Date(alert.timestamp).toLocaleString()}</small>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="table-container">
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                        <h3>Data Correction Requests</h3>
                    </div>
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No pending rectification requests.
                    </div>
                </div>
            </div>

            <div className="table-container">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <History size={20} /> Global Access Audit Trail
                    </h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Actor</th>
                            <th>Patient</th>
                            <th>Action</th>
                            <th>IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditLogs.map(log => (
                            <tr key={log.id}>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                <td><strong>{log.actor_name}</strong></td>
                                <td>{log.patient_name || 'N/A'}</td>
                                <td><code style={{ background: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{log.action}</code></td>
                                <td>{log.ip_address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Security;
