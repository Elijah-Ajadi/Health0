import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const MobileBottomNav = ({ role }) => {
    const navigate = useNavigate()
    const location = useLocation()

    const navItems = {
        PATIENT: [
            { icon: 'home', label: 'Home', path: '/patient-dashboard' },
            { icon: 'history', label: 'History', path: '/records' },
            { icon: 'calendar_today', label: 'Appointments', path: '/appointments' },
            { icon: 'settings', label: 'Account', path: '/settings' }
        ],
        HOSPITAL: [
            { icon: 'dashboard', label: 'Overview', path: '/hospital-dashboard' },
            { icon: 'groups', label: 'Patients', path: '/hospital-patients' },
            { icon: 'upload_file', label: 'Upload', path: '/hospital-records' },
            { icon: 'settings', label: 'Portal', path: '/hospital-settings' }
        ],
        ADMIN: [
            { icon: 'monitoring', label: 'Analytics', path: '/admin-dashboard' },
            { icon: 'verified_user', label: 'Verification', path: '/admin-verification' },
            { icon: 'shield_person', label: 'Guardians', path: '/admin-users' },
            { icon: 'settings', label: 'Config', path: '/admin-config' }
        ]
    }

    const items = navItems[role] || navItems.PATIENT

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 w-full h-20 bg-surface/85 backdrop-blur-2xl border-t border-outline-variant/10 flex items-center justify-around px-4 pb-2 z-50 transition-all shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
            {items.map(({ icon, label, path }) => {
                const isActive = location.pathname === path
                return (
                    <button
                        key={path}
                        onClick={() => navigate(path)}
                        className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 active:scale-90 ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                    >
                        <span 
                            className="material-symbols-outlined text-[24px] mb-1 transition-transform"
                            style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                        >
                            {icon}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                            {label}
                        </span>
                        {isActive && (
                            <motion.div 
                                layoutId="active-dot"
                                className="w-1 h-1 bg-primary rounded-full absolute -bottom-1"
                            />
                        )}
                    </button>
                )
            })}
        </nav>
    )
}

export default MobileBottomNav
