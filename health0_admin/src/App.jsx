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
import { Activity, Shield, Users, Building, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/verification/analytics/').then(res => setStats(res.data));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="main-content"
    >
      <header className="page-header">
        <div>
          <h1 className="page-title">Platform Overview</h1>
          <p className="page-subtitle">Welcome back, Admin. Here's a summary of the ecosystem.</p>
        </div>
      </header>

      <div className="stats-grid">
        {[
          { icon: Building, color: 'var(--primary)', label: 'Active Hospitals', value: '24', badge: '+4 this week', badgeClass: 'badge-active' },
          { icon: Activity, color: 'var(--success)', label: 'Total KYCs Performed', value: stats?.total_verifications || 0, badge: `${stats?.success_rate}% Success`, badgeClass: 'badge-active' },
          { icon: Shield, color: 'var(--danger)', label: 'System Security Status', value: 'Healthy', badge: '0 Recent Alerts', badgeClass: 'badge-danger' },
          { icon: Users, color: 'var(--primary)', label: 'Verified Patients', value: '1,204', badge: null },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="stat-icon-wrapper" style={{ padding: '0.75rem', borderRadius: '1rem', background: `${item.color}15` }}>
                <item.icon color={item.color} size={24} />
              </div>
              {item.badge && <span className={`badge ${item.badgeClass}`}>{item.badge}</span>}
            </div>
            <div className="stat-value">{item.value}</div>
            <div className="stat-label">{item.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid-2" style={{ marginTop: '3.5rem' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="table-container"
          style={{ padding: '2rem' }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Recent System Activity</h3>
          <div style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.8' }}>
            <p>• Hospital "St. Marys" approved by Admin</p>
            <p>• System Maintenance mode toggled OFF</p>
            <p>• New Support Ticket #402 opened</p>
            <p>• Security Scan: No anomalies detected.</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="table-container"
          style={{ padding: '2rem' }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>KYC Credit Consumption</h3>
          <div style={{ marginTop: '1.5rem', height: '140px', background: 'var(--bg-main)', borderRadius: '1.25rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--primary)', fontSize: '2rem', fontWeight: '900' }}>{stats?.api_credits_remaining || 0}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Credits Remaining</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('admin_token'));
  const [theme, setTheme] = useState(localStorage.getItem('admin_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('admin_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <Sidebar />
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          padding: '10px',
          borderRadius: '50%',
          cursor: 'pointer',
          boxShadow: 'var(--shadow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-main)'
        }}
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/identity" element={<Identity />} />
          <Route path="/security" element={<Security />} />
          <Route path="/config" element={<Config />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

export default App;
