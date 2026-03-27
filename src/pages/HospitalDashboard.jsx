import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const HospitalDashboard = () => {
    const { user, logout } = useAuth()
    const [stats, setStats] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(true)

    const profile = user?.hospital_profile || {}
    const isPending = profile.status === 'PENDING'

    useEffect(() => {
        if (!isPending) {
            fetchAnalytics()
        } else {
            setLoading(false)
        }
    }, [isPending])

    const fetchAnalytics = async () => {
        try {
            const res = await api.get('/hospital/analytics/')
            setStats(res.data)
        } catch (err) {
            console.error('Failed to fetch analytics:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!searchQuery) return
        try {
            const res = await api.get(`/hospital/search/?q=${searchQuery}`)
            setSearchResults(res.data)
        } catch (err) {
            console.error('Search failed:', err)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-primary/10"></div>
                <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">Syncing Provider Node...</p>
            </div>
        )
    }

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-[70vh] p-6 text-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl w-full bg-surface-container-lowest rounded-[3rem] p-12 shadow-modal border border-outline-variant/10"
                >
                    <div className="w-24 h-24 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
                        <span className="material-symbols-outlined text-5xl text-primary animate-pulse">pending_actions</span>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full border-4 border-surface"></div>
                    </div>
                    <h1 className="text-3xl font-headline font-black text-on-surface uppercase italic tracking-tight mb-4">Verification in Progress</h1>
                    <p className="text-on-surface-variant font-medium leading-relaxed mb-10">
                        Welcome to the network, <strong>{profile.hospital_name}</strong>. Our clinical integrity team is currently vetting your medical licenses and CAC documentation.
                    </p>
                    <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10 mb-10 text-left space-y-4">
                        <StatusStep label="Identity Secured" complete />
                        <StatusStep label="Document Inspection" active />
                        <StatusStep label="Global Registry Activation" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Estimated duration: 24-48 Hours</p>
                    <button onClick={logout} className="mt-8 text-primary font-black uppercase tracking-widest text-xs hover:underline flex items-center justify-center gap-2 mx-auto">
                        <span className="material-symbols-outlined text-sm">logout</span> Terminate Session
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="space-y-8 lg:space-y-12">
            {/* ─── PROVIDER HEADER ─── */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-full border border-primary/10">Clinical Node Active</span>
                        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] px-3 py-1">Facility ID: {profile.hefamaa_id || 'LAG-000'}</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-headline font-black text-on-surface tracking-tight leading-none italic uppercase">
                        Portal <span className="text-primary tracking-tighter">Control</span>
                    </h1>
                </div>
                <div className="flex gap-3">
                    <button className="flex-1 md:flex-initial px-8 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-xl">person_add</span>
                        Register Patient
                    </button>
                    <button className="flex-1 md:flex-initial px-8 py-4 bg-surface-container-high text-on-surface rounded-2xl font-bold text-sm border border-outline-variant/10 hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-xl">upload_file</span>
                        Bulk Import
                    </button>
                </div>
            </section>

            {/* ─── CLINICAL METRICS ─── */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard icon="groups" label="Identity Registry" value={stats?.total_patients || '0'} color="primary" />
                <StatCard icon="description" label="Active Records" value={stats?.total_records || '0'} color="emerald" />
                <StatCard icon="verified" label="Global Trust" value="100%" color="blue" />
                <StatCard icon="schedule" label="Pending Tasks" value={stats?.pending_appointments || '0'} color="amber" />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* ─── PATIENT DISCOVERY (LEFT) ─── */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-headline font-black text-on-surface italic uppercase tracking-tighter">Patient Discovery</h2>
                        <button className="text-primary font-bold text-xs uppercase tracking-widest hover:underline">Access Registry</button>
                    </div>

                    <form onSubmit={handleSearch} className="relative group">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/40 group-focus-within:text-primary transition-colors">search</span>
                        <input 
                            type="text" 
                            placeholder="Universal Search (NIN, ID, or Legal Name)..."
                            className="w-full bg-surface-container-lowest border-2 border-transparent focus:border-primary/20 rounded-3xl pl-16 pr-8 py-6 shadow-subtle focus:shadow-xl focus:shadow-primary/5 transition-all outline-none font-bold text-on-surface placeholder:text-outline/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-on-surface text-surface px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest italic active:scale-95 transition-all">Probe Vault</button>
                    </form>

                    <div className="space-y-4">
                        {searchResults.length > 0 ? searchResults.map(patient => (
                            <motion.div 
                                key={patient.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-subtle hover:border-primary/20 transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center text-on-surface-variant group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-4xl">fingerprint</span>
                                    </div>
                                    <div>
                                        <h4 className="font-headline font-black text-lg text-on-surface uppercase italic leading-none mb-1">{patient.user.first_name} {patient.user.last_name}</h4>
                                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Clinical Ledger ID: {patient.nin}</p>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 bg-surface-container-high px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-on-surface group-hover:bg-primary group-hover:text-white transition-all shadow-sm active:scale-95">
                                    Access Records
                                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                </button>
                            </motion.div>
                        )) : searchQuery && (
                            <div className="text-center py-20 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant/20">
                                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">manage_search</span>
                                <p className="text-on-surface font-black uppercase tracking-tight text-lg">Identity not found in global registry</p>
                                <p className="text-on-surface-variant text-sm mt-1">Please verify the NIN or Hospital ID and try again.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── SECURE TOOLS (RIGHT) ─── */}
                <aside className="lg:col-span-4 space-y-8">
                    <div className="bg-on-background rounded-[2.5rem] p-10 text-white space-y-8 relative overflow-hidden group shadow-xl">
                        <div className="relative z-10">
                            <h3 className="font-headline font-black text-2xl uppercase italic mb-8 tracking-tighter">Secured Entry</h3>
                            <div className="space-y-4">
                                <SecureTool icon="history_edu" label="Clinical Note" ext=".pdf, .docs" />
                                <SecureTool icon="radiology" label="Diagnostic Image" ext=".dcm, .jpg" />
                                <SecureTool icon="lab_research" label="Laboratory Result" ext=".hl7, .pdf" />
                            </div>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em] mt-10 leading-relaxed font-body">All uploads are locally encrypted (AES-256) before global ledger synchronization.</p>
                        </div>
                        <span className="absolute right-[-40px] bottom-[-40px] material-symbols-outlined text-white/5 text-[180px] rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none">shield</span>
                    </div>

                    <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 space-y-6">
                        <h4 className="font-headline font-black text-primary text-xl uppercase tracking-tight italic">System Status</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-primary/10">
                                <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest">Global Sync</span>
                                <span className="text-emerald-500 font-bold text-xs uppercase">Operational</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-primary/10">
                                <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest">Trust Store</span>
                                <span className="text-emerald-500 font-bold text-xs uppercase">Verified</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest">Latency</span>
                                <span className="text-on-surface font-bold text-xs uppercase">12ms</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

const StatusStep = ({ label, complete, active }) => (
    <div className="flex items-center gap-4">
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${complete ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : active ? 'border-primary text-primary animate-pulse' : 'border-outline-variant/30 text-outline-variant'}`}>
            {complete ? <span className="material-symbols-outlined text-[18px]">check</span> : <div className="w-2 h-2 rounded-full bg-current opacity-30" />}
        </div>
        <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${complete ? 'text-on-surface' : active ? 'text-primary' : 'text-on-surface-variant opacity-50'}`}>{label}</span>
    </div>
)

const StatCard = ({ icon, value, label, color }) => (
    <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-subtle hover:border-primary/20 transition-all group">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${
            color === 'primary' ? 'bg-primary/5 text-primary' :
            color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
            color === 'blue' ? 'bg-blue-50 text-blue-600' :
            'bg-amber-50 text-amber-600'
        }`}>
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">{icon}</span>
        </div>
        <div className="text-3xl font-headline font-black text-on-surface leading-none mb-1.5">{value}</div>
        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{label}</p>
    </div>
)

const SecureTool = ({ icon, label, ext }) => (
    <button className="w-full bg-white/5 hover:bg-white/10 p-5 rounded-3xl border border-white/10 flex items-center justify-between group transition-all">
        <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>{icon}</span>
            </div>
            <div className="text-left leading-none">
                <p className="text-xs font-black uppercase tracking-[0.1em] italic mb-1.5">{label}</p>
                <p className="text-[10px] text-white/30 font-mono font-bold">{ext}</p>
            </div>
        </div>
        <span className="material-symbols-outlined text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
    </button>
)

export default HospitalDashboard
