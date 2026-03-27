import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MobileHeader from './MobileHeader'
import MobileBottomNav from './MobileBottomNav'
import Sidebar from './Sidebar'
import { useAuth } from '../../context/AuthContext'

/**
 * AppShell - The primary layout wrapper for authenticated users.
 * @param {React.ReactNode} children - The page content
 */
const AppShell = ({ children }) => {
    const { user } = useAuth()
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
                onOpenProfile={() => {/* Navigate to profile or open menu */}}
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
                            className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-surface shadow-modal z-[70] lg:hidden p-6"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-headline font-black text-on-surface">Notifications</h3>
                                <button onClick={() => setIsNotificationsOpen(false)} className="material-symbols-outlined text-on-surface-variant">close</button>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10">
                                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">System</p>
                                    <p className="text-sm font-medium text-on-surface">Your health ID has been synchronized with the main node.</p>
                                    <p className="text-[10px] text-on-surface-variant mt-2">2 minutes ago</p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AppShell
