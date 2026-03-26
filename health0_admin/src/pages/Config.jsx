import React, { useState, useEffect } from 'react';
import api from '../api';
import { Settings, Power, Bell, Key, Radio } from 'lucide-react';

const Config = () => {
    const [config, setConfig] = useState(null);
    const [ussd, setUssd] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [configRes, ussdRes] = await Promise.all([
            api.get('/admin/config/'),
            api.get('/admin/ussd/status/')
        ]);
        setConfig(configRes.data);
        setUssd(ussdRes.data);
    };

    const handleToggle = async (field, value) => {
        const res = await api.patch('/admin/config/', { [field]: value });
        setConfig(res.data);
    };

    return (
        <div className="main-content">
            <header className="page-header">
                <h1 className="page-title">System Configuration (Engine Room)</h1>
                <p className="page-subtitle">Master controls for platform behavior and integrations.</p>
            </header>

            <div className="grid-2">
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Power size={20} color={config?.maintenance_mode ? 'var(--danger)' : 'var(--success)'} />
                                Maintenance Mode
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                Globally disable record retrieval for all users.
                            </p>
                        </div>
                        <button
                            className={`btn ${config?.maintenance_mode ? 'btn-danger' : 'btn-secondary'}`}
                            onClick={() => handleToggle('maintenance_mode', !config.maintenance_mode)}
                            style={{ background: config?.maintenance_mode ? 'var(--danger)' : '' }}
                        >
                            {config?.maintenance_mode ? 'ON' : 'OFF'}
                        </button>
                    </div>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Radio size={20} color={ussd?.status === 'ONLINE' ? 'var(--success)' : 'var(--danger)'} />
                                USSD Gateway Monitor
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                Gateway: {ussd?.gateway} | Status: {ussd?.status}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-container" style={{ marginTop: '2rem', padding: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <Bell size={20} /> Global Messaging & Notifications
                </h3>
                <textarea
                    className="stat-card"
                    style={{ width: '100%', minHeight: '120px', textAlign: 'left', marginBottom: '1rem' }}
                    placeholder="Enter custom broadcast message for all active hospitals..."
                    value={config?.global_message}
                    onChange={(e) => setConfig({ ...config, global_message: e.target.value })}
                />
                <button className="btn btn-primary" onClick={() => handleToggle('global_message', config.global_message)}>
                    Update Broadcast Message
                </button>
            </div>

            <div className="table-container" style={{ marginTop: '2rem', padding: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <Key size={20} /> API Key Management
                </h3>
                <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Hospitals can generate their own keys once approved. Admins can revoke keys from the Hospital Registry.</p>
                </div>
            </div>
        </div>
    );
};

export default Config;
