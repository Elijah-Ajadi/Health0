import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Sidebar = ({ role, user }) => {
    const navigate = useNavigate()
    const location = useLocation()

    const navItems = {
        PATIENT: [
            { icon: 'home', label: 'Dashboard', path: '/patient-dashboard' },
            { icon: 'history', label: 'Health Timeline', path: '/records' },
            { icon: 'calendar_today', label: 'Appointments', path: '/appointments' },
            { icon: 'medical_information', label: 'My Providers', path: '/providers' },
            { icon: 'settings', label: 'Security & Settings', path: '/settings' }
        ],
        HOSPITAL: [
            { icon: 'dashboard', label: 'Portal Overview', path: '/hospital-dashboard' },
            { icon: 'groups', label: 'Patient Registry', path: '/hospital-patients' },
            { icon: 'upload_file', label: 'Clinical Records', path: '/hospital-records' },
            { icon: 'analytics', label: 'Insights', path: '/hospital-insights' },
            { icon: 'settings', label: 'Institutional Settings', path: '/hospital-settings' }
        ],
        ADMIN: [
            { icon: 'monitoring', label: 'Network Health', path: '/admin-dashboard' },
            { icon: 'verified_user', label: 'Hospital Verification', path: '/admin-verification' },
            { icon: 'shield_person', label: 'User Governance', path: '/admin-users' },
            { icon: 'settings', label: 'System Configuration', path: '/admin-config' }
        ]
    }

    const items = navItems[role] || navItems.PATIENT

    return (
        <aside className="hidden lg:flex flex-col w-80 fixed left-0 top-0 h-full bg-surface-container-lowest border-r border-outline-variant/15 z-40 transition-all">
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-10 group cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">healing</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-on-surface tracking-tighter font-headline leading-none">Health0</h1>
                        <p className="text-[10px] text-on-surface-variant mt-1 uppercase tracking-[0.2em] font-bold">Clinical Network</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {items.map(({ icon, label, path }) => {
                        const isActive = location.pathname === path
                        return (
                            <button
                                key={path}
                                onClick={() => navigate(path)}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
                            >
                                <span className={`material-symbols-outlined text-[20px]`} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                                    {icon}
                                </span>
                                <span className="tracking-tight">{label}</span>
                                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                            </button>
                        )
                    })}
                </nav>
            </div>

            <div className="mt-auto p-8 border-t border-outline-variant/10">
                <div className="p-4 rounded-3xl bg-surface-container-low border border-outline-variant/10 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
                            {user?.first_name?.[0] || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-on-surface truncate">{user?.first_name} {user?.last_name}</p>
                            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">{role}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 px-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Active Node</span>
                    </div>
                </div>
                
                <button className="w-full flex items-center justify-center gap-2 p-4 text-on-surface-variant hover:text-error font-bold text-xs uppercase tracking-[0.1em] transition-colors rounded-2xl hover:bg-error/5 group">
                    <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">logout</span>
                    Terminate Session
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
