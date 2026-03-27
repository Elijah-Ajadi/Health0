import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

/* ─── animated floating orb ───────────────────────────────────────────────── */
const Orb = ({ className, delay = 0, size = 320 }) => (
    <motion.div
        className={`absolute rounded-full pointer-events-none ${className}`}
        style={{ width: size, height: size }}
        animate={{ y: [0, -24, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
)

/* ─── ECG / heartbeat line drawn with SVG ─────────────────────────────────── */
const HeartbeatLine = () => {
    const pathRef = useRef(null)

    useEffect(() => {
        const path = pathRef.current
        if (!path) return
        const len = path.getTotalLength()
        path.style.strokeDasharray = len
        path.style.strokeDashoffset = len
        let start = null
        const duration = 2200

        const animate = (ts) => {
            if (!start) start = ts
            const progress = Math.min((ts - start) / duration, 1)
            path.style.strokeDashoffset = len * (1 - progress)
            if (progress < 1) requestAnimationFrame(animate)
            else {
                setTimeout(() => {
                    start = null
                    requestAnimationFrame(animate)
                }, 1800)
            }
        }
        requestAnimationFrame(animate)
    }, [])

    return (
        <svg viewBox="0 0 400 80" fill="none" xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-sm mx-auto opacity-70">
            <path
                ref={pathRef}
                d="M0 40 L60 40 L75 40 L90 10 L105 70 L120 25 L135 55 L150 40 L200 40 L215 40 L230 10 L245 70 L260 25 L275 55 L290 40 L400 40"
                stroke="#0040a1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

/* ─── quick links ─────────────────────────────────────────────────────────── */
const QuickLink = ({ icon, label, desc, to, navigate }) => (
    <motion.button
        onClick={() => navigate(to)}
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all text-left w-full"
    >
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                {icon}
            </span>
        </div>
        <div>
            <div className="text-sm font-bold text-slate-900 leading-tight">{label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
        </div>
    </motion.button>
)

/* ─── main component ──────────────────────────────────────────────────────── */
const NotFoundPage = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const links = user?.role === 'HOSPITAL'
        ? [
            { icon: 'grid_view', label: 'Hospital Dashboard', desc: 'Back to your control centre', to: '/dashboard' },
            { icon: 'people', label: 'Patient Registry', desc: 'Browse and search patients', to: '/hospital/patients' },
            { icon: 'folder_open', label: 'Clinical Records', desc: 'View all secured records', to: '/hospital/records' },
        ]
        : user
        ? [
            { icon: 'grid_view', label: 'My Dashboard', desc: 'Back to your health overview', to: '/dashboard' },
            { icon: 'upload_file', label: 'Upload Record', desc: 'Add a new medical document', to: '/upload' },
            { icon: 'manage_accounts', label: 'My Profile', desc: 'View and edit your details', to: '/profile' },
        ]
        : [
            { icon: 'home_health', label: 'Home', desc: 'Return to the landing page', to: '/' },
            { icon: 'login', label: 'Sign In', desc: 'Access your Health0 account', to: '/login' },
            { icon: 'how_to_reg', label: 'Register', desc: 'Create a new patient account', to: '/patient/register' },
        ]

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex flex-col items-center justify-center overflow-hidden px-6 py-16">

            {/* Background orbs */}
            <Orb className="bg-blue-100/60 blur-3xl -top-24 -left-24" delay={0} size={400} />
            <Orb className="bg-indigo-100/40 blur-3xl -bottom-24 -right-16" delay={2} size={360} />
            <Orb className="bg-cyan-100/30 blur-2xl top-1/3 right-1/4" delay={1.5} size={200} />

            <div className="relative z-10 max-w-md w-full flex flex-col items-center">

                {/* Header badge */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-200 rounded-full mb-8"
                >
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-700">
                        System Alert — Clinical Hub
                    </span>
                </motion.div>

                {/* Giant 404 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative select-none mb-2"
                >
                    <div className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-blue-700 via-blue-500 to-indigo-400"
                        style={{ fontFamily: 'Manrope, sans-serif' }}>
                        404
                    </div>
                    {/* Subtle ghost repeat */}
                    <div className="absolute inset-0 text-[120px] sm:text-[160px] font-black leading-none tracking-tighter text-blue-100 -z-10 translate-x-1 translate-y-1 select-none"
                        style={{ fontFamily: 'Manrope, sans-serif' }}>
                        404
                    </div>
                </motion.div>

                {/* Heartbeat line */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-full mb-6"
                >
                    <HeartbeatLine />
                </motion.div>

                {/* Text */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 leading-tight"
                        style={{ fontFamily: 'Manrope, sans-serif' }}>
                        Record Not Found
                    </h1>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                        This clinical path doesn't exist in the registry. It may have moved, been removed, or the URL was entered incorrectly.
                    </p>
                </motion.div>

                {/* Quick links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="w-full space-y-3 mb-8"
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center mb-4">
                        Where would you like to go?
                    </p>
                    {links.map((link, i) => (
                        <motion.div
                            key={link.to}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.55 + i * 0.08 }}
                        >
                            <QuickLink {...link} navigate={navigate} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.85 }}
                    className="flex items-center gap-1.5 text-[11px] text-slate-400"
                >
                    <span className="material-symbols-outlined text-base text-slate-300" style={{ fontVariationSettings: "'FILL' 1" }}>
                        health_and_safety
                    </span>
                    Health0 — Secure Clinical Platform
                </motion.div>

            </div>
        </div>
    )
}

export default NotFoundPage
