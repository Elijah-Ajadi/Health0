import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Hospitals from './pages/Hospitals';
import Identity from './pages/Identity';
import Security from './pages/Security';
import Config from './pages/Config';
import Support from './pages/Support';
import api from './api';
import { Activity, Shield, Users, Building } from 'lucide-react';

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/verification/analytics/').then(res => setStats(res.data));
  }, []);

  return (
    <div className="main-content">
      <header className="page-header">
        <h1 className="page-title">Platform Overview</h1>
        <p className="page-subtitle">Welcome back, Admin. Here's a summary of the ecosystem.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Building color="var(--primary)" />
            <span className="badge badge-active">+4 this week</span>
          </div>
          <div className="stat-value">24</div>
          <div className="stat-label">Active Hospitals</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Activity color="var(--success)" />
            <span className="badge badge-active">{stats?.success_rate}% Success</span>
          </div>
          <div className="stat-value">{stats?.total_verifications || 0}</div>
          <div className="stat-label">Total KYCs Performed</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Shield color="var(--danger)" />
            <span className="badge badge-danger">0 Recent Alerts</span>
          </div>
          <div className="stat-value">Healthy</div>
          <div className="stat-label">System Security Status</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Users color="var(--primary)" />
          </div>
          <div className="stat-value">1,204</div>
          <div className="stat-label">Verified Patients</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '2.5rem' }}>
        <div className="table-container" style={{ padding: '1.5rem' }}>
          <h3>Recent System Activity</h3>
          <div style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            - Hospital "St. Marys" approved by Admin<br />
            - System Maintenance mode toggled OFF<br />
            - New Support Ticket #402 opened<br />
            - Security Scan: No anomalies detected.
          </div>
        </div>
        <div className="table-container" style={{ padding: '1.5rem' }}>
          <h3>KYC Credit Consumption</h3>
          <div style={{ height: '100px', background: '#f8fafc', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
            {stats?.api_credits_remaining} CREDITS REMAINING
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('admin_token'));

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/identity" element={<Identity />} />
        <Route path="/security" element={<Security />} />
        <Route path="/config" element={<Config />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
