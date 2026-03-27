import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MobileHeader from './MobileHeader'
import MobileBottomNav from './MobileBottomNav'
import Sidebar from './Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Button } from '../ui'

/**
 * AppShell - The primary layout wrapper for authenticated users.
 * @param {React.ReactNode} children - The page content
 */
const AppShell = ({ children }) => {
    const { user } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

    // Ensure we have a fallback role if context is still loading
    const role = user?.role || 'PATIENT'

    return (
        <div className="min-h-screen bg-surface font-body text-on-surface selection:bg-primary/10 transition-colors duration-500">
            {/* ─── DESKTOP SIDEBAR ─── */}
            <Sidebar role={role} user={user} />

            {/* ─── MOBILE TOP BAR ─── */}
            <MobileHeader 
                user={user} 
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                onOpenProfile={() => navigate('/settings')}
            />

            {/* ─── MAIN CONTENT AREA ─── */}
            <main className="lg:pl-80 pt-16 pb-24 lg:pt-0 lg:pb-0 min-h-screen">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="p-6 lg:p-12 max-w-[1600px] mx-auto"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ─── MOBILE BOTTOM NAV ─── */}
            <MobileBottomNav role={role} />

            {/* ─── NOTIFICATION OVERLAY (Example) ─── */}
            <AnimatePresence>
                {isNotificationsOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsNotificationsOpen(false)}
                            className="fixed inset-0 bg-on-background/20 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-surface shadow-[-20px_0_60px_rgba(0,0,0,0.1)] z-[70] lg:hidden p-6 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-headline font-black text-on-surface italic uppercase tracking-tighter">Notifications</h3>
                                <button onClick={() => setIsNotificationsOpen(false)} className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-on-surface-variant">close</span>
                                </button>
                            </div>
                            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <Card padding="p-4">
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">System Node</p>
                                    <p className="text-sm font-medium text-on-surface leading-snug">Your health ID has been synchronized with the global clinical network.</p>
                                    <p className="text-[10px] text-on-surface-variant mt-2 font-bold">2m ago</p>
                                </Card>
                            </div>
                            <div className="pt-6 border-t border-outline-variant/10">
                                <Button variant="surface" size="sm" className="w-full" onClick={() => setIsNotificationsOpen(false)}>
                                    Dismiss All
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AppShell
