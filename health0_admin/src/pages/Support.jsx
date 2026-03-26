import React, { useState, useEffect } from 'react';
import api from '../api';
import { LifeBuoy, Users, Ticket, CheckCircle, Clock } from 'lucide-react';

const Support = () => {
    const [tickets, setTickets] = useState([]);
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [ticketRes, staffRes] = await Promise.all([
            api.get('/admin/support/tickets/'),
            api.get('/admin/staff/sub-admins/')
        ]);
        setTickets(ticketRes.data);
        setStaff(staffRes.data);
    };

    return (
        <div className="main-content">
            <header className="page-header">
                <h1 className="page-title">User Support & Helpdesk</h1>
                <p className="page-subtitle">Manage system issues and administrative staff accounts.</p>
            </header>

            <div className="grid-2">
                <div className="table-container">
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Ticket size={20} /> Support Tickets
                        </h3>
                        <span className="badge badge-pending">{tickets.length} Total</span>
                    </div>
                    <div style={{ padding: '1rem' }}>
                        {tickets.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No open tickets.</p>
                        ) : (
                            tickets.map(t => (
                                <div key={t.id} className="stat-card" style={{ marginBottom: '1rem', background: t.status === 'OPEN' ? '#fff' : '#f1f5f9' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <strong>{t.subject}</strong>
                                        <span className={`badge badge-${t.status === 'OPEN' ? 'pending' : 'active'}`}>{t.status}</span>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>{t.message}</p>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        From: {t.creator_name} | {new Date(t.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="table-container">
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Users size={20} /> Internal Staff Management
                        </h3>
                    </div>
                    <div style={{ padding: '1rem' }}>
                        {staff.map(s => (
                            <div key={s.id} className="stat-card" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: '50%' }}>
                                    <Shield size={20} color="var(--primary)" />
                                </div>
                                <div>
                                    <strong>{s.username}</strong>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role: {s.role} | Sub-Admin Permissions</p>
                                </div>
                            </div>
                        ))}
                        <div style={{ marginTop: '1rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>To create a sub-admin, use the system CLI or promote an existing user.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
