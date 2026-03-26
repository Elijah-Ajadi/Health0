import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    Fingerprint,
    ShieldAlert,
    Settings,
    LifeBuoy,
    LogOut
} from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Building2, label: 'Hospitals', path: '/hospitals' },
        { icon: Fingerprint, label: 'Identity', path: '/identity' },
        { icon: ShieldAlert, label: 'Security', path: '/security' },
        { icon: Settings, label: 'Engine Room', path: '/config' },
        { icon: LifeBuoy, label: 'Support', path: '/support' },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <h1 className="logo-text">Health<span>0</span> Admin</h1>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="sidebar-footer">
                <button className="logout-btn" onClick={() => {
                    localStorage.removeItem('admin_token');
                    window.location.reload();
                }}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
