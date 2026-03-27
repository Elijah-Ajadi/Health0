import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const AdminDashboard = () => {
    const { logout } = useAuth()
    const [hospitals, setHospitals] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('ALL')

    useEffect(() => {
        fetchAdminData()
    }, [])

    const fetchAdminData = async () => {
        try {
            const [hospRes, statsRes] = await Promise.all([
                api.get('/hospitals/'),
                api.get('/admin/stats/') 
            ])
            setHospitals(hospRes.data)
            setStats(statsRes.data || {
                total_patients: '142.8k',
                active_hospitals: hospRes.data.filter(h => h.status === 'VERIFIED').length,
                pending_verifications: hospRes.data.filter(h => h.status === 'PENDING').length,
                clinical_records: '3.4M'
            })
        } catch (err) {
            console.error('Failed to fetch admin data:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async (id, status) => {
        try {
            await api.patch(`/hospitals/${id}/`, { status })
            fetchAdminData()
        } catch (err) {
            console.error('Verification update failed:', err)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-primary/10"></div>
                <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">Initializing Root Authority...</p>
            </div>
        )
    }

    const filteredHospitals = filter === 'ALL' 
        ? hospitals 
        : hospitals.filter(h => h.status === filter)

    return (
        <div className="space-y-8 lg:space-y-12">
            {/* ─── SYSTEM OVERVIEW ─── */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-full border border-primary/10">Global Governance</span>
                        <div className="flex items-center gap-1.5 px-3 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Network Operational</span>
                        </div>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-headline font-black text-on-surface tracking-tight leading-none italic uppercase">
                        Command <span className="text-primary tracking-tighter">Center</span>
                    </h1>
                </div>
                <div className="flex gap-3">
                    <button className="flex-1 md:flex-initial px-8 py-4 bg-on-surface text-surface rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-xl">terminal</span>
                        System Logs
                    </button>
                    <button className="flex-1 md:flex-initial px-8 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-xl">shield_person</span>
                        Audit Users
                    </button>
                </div>
            </section>

            {/* ─── GLOBAL METRICS ─── */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <AdminStatCard icon="hub" value={stats?.total_patients} label="Total Identities" color="primary" trend="+4.2k" />
                <AdminStatCard icon="account_balance" value={stats?.active_hospitals} label="Active Providers" color="emerald" trend="+12" />
                <AdminStatCard icon="verified_user" value={stats?.pending_verifications} label="Vetting Queue" color="amber" trend="Priority" />
                <AdminStatCard icon="analytics" value={stats?.clinical_records} label="Indexed Records" color="blue" trend="+240k" />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* ─── VETTING QUEUE (LEFT) ─── */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-headline font-black text-on-surface italic uppercase tracking-tighter">Provider Vetting Queue</h2>
                        <div className="flex bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/10">
                            <FilterBtn label="All" active={filter === 'ALL'} onClick={() => setFilter('ALL')} />
                            <FilterBtn label="Pending" active={filter === 'PENDING'} onClick={() => setFilter('PENDING')} />
                            <FilterBtn label="Verified" active={filter === 'VERIFIED'} onClick={() => setFilter('VERIFIED')} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {filteredHospitals.length > 0 ? filteredHospitals.map((hosp) => (
                                <motion.div 
                                    key={hosp.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-subtle hover:border-primary/20 transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                                        <div className="flex items-start gap-6">
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-colors ${hosp.status === 'VERIFIED' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                                                <span className="material-symbols-outlined text-4xl">{hosp.status === 'VERIFIED' ? 'domain_verification' : 'account_balance'}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <h4 className="text-xl font-headline font-black text-on-surface uppercase italic leading-none">{hosp.hospital_name}</h4>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${hosp.status === 'VERIFIED' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>{hosp.status}</span>
                                                </div>
                                                <p className="text-sm font-bold text-on-surface-variant flex items-center gap-2 capitalize">
                                                    {hosp.category} • {hosp.address}
                                                </p>
                                                <div className="flex gap-4 mt-4">
                                                    <DocumentLink label="CAC" />
                                                    <DocumentLink label="HEFAMAA" />
                                                    <DocumentLink label="TIN" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {hosp.status === 'PENDING' ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleVerify(hosp.id, 'VERIFIED')}
                                                        className="px-6 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-primary/20 active:scale-95 transition-all"
                                                    >
                                                        Activate Provision
                                                    </button>
                                                    <button className="p-4 bg-surface-container-high text-error rounded-2xl hover:bg-error hover:text-white transition-all">
                                                        <span className="material-symbols-outlined text-xl">block</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="bg-surface-container-high text-on-surface-variant px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 hover:bg-on-surface hover:text-surface transition-all">
                                                    <span className="material-symbols-outlined text-[18px]">history</span> Audit Trail
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="text-center py-24 bg-surface-container-low border-2 border-dashed border-outline-variant/20 rounded-[3rem] flex flex-col items-center gap-4">
                                    <span className="material-symbols-outlined text-6xl text-outline-variant">playlist_add_check</span>
                                    <div>
                                        <p className="text-on-surface font-black uppercase tracking-tight text-lg italic">Verification Queue Clear</p>
                                        <p className="text-on-surface-variant text-sm mt-1">All provider nodes are currently synchronized and verified.</p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ─── NETWORK HEALTH (RIGHT) ─── */}
                <aside className="lg:col-span-4 space-y-8">
                    <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10 space-y-8">
                        <h4 className="font-headline font-black text-primary text-xl uppercase tracking-tighter italic">Network Topology</h4>
                        <div className="space-y-6">
                            <TopologyItem label="Master Identity Node" status="Operational" />
                            <TopologyItem label="Ledger Synchronization" status="Syncing" active />
                            <TopologyItem label="Biometric Gateway" status="Operational" />
                            <TopologyItem label="Encrypted Storage" status="Operational" />
                        </div>
                        <div className="pt-6 border-t border-primary/10">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                <span>Global Latency</span>
                                <span className="text-primary">14ms average</span>
                            </div>
                            <div className="mt-2 h-1 bg-primary/10 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-1/3 h-full bg-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant/10 shadow-subtle space-y-6">
                        <h4 className="font-headline font-black text-on-surface text-xl uppercase tracking-tight">System Events</h4>
                        <div className="space-y-4">
                            <EventLog label="Root login detected" time="Just now" type="security" />
                            <EventLog label="St. Jude Facility verified" time="4m ago" type="success" />
                            <EventLog label="New identity node registered" time="12m ago" type="info" />
                        </div>
                        <button className="w-full py-4 border-2 border-outline-variant/10 rounded-2xl text-on-surface-variant font-bold text-[10px] uppercase tracking-widest hover:border-primary/20 transition-all">Export Root Logs</button>
                    </div>
                </aside>
            </div>
        </div>
    )
}

const AdminStatCard = ({ icon, value, label, color, trend }) => (
    <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-subtle transition-all group overflow-hidden relative">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${
            color === 'primary' ? 'bg-primary/5 text-primary' :
            color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
            color === 'amber' ? 'bg-amber-50 text-amber-600' :
            'bg-blue-50 text-blue-600'
        }`}>
            <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">{icon}</span>
        </div>
        <div className="text-4xl font-headline font-black text-on-surface leading-none mb-2">{value}</div>
        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-6">{label}</p>
        <div className={`text-[9px] font-black px-3 py-1 rounded-full w-fit uppercase tracking-widest ${
            color === 'primary' ? 'bg-primary/10 text-primary' :
            color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
            color === 'amber' ? 'bg-amber-100 text-amber-700' :
            'bg-blue-100 text-blue-700'
        }`}>{trend}</div>
    </div>
)

const TopologyItem = ({ label, status, active }) => (
    <div className="flex items-center gap-4">
        <div className={`w-2 h-2 rounded-full ${status === 'Operational' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-primary animate-pulse shadow-[0_0_8px_#4285f4]'}`}></div>
        <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</span>
        <span className="ml-auto text-[9px] font-black text-primary uppercase">{status}</span>
    </div>
)

const FilterBtn = ({ label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-on-surface text-surface shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
    >
        {label}
    </button>
)

const DocumentLink = ({ label }) => (
    <div className="flex items-center gap-1.5 text-primary hover:text-primary-container cursor-pointer transition-colors group">
        <span className="material-symbols-outlined text-[16px] group-hover:rotate-45 transition-transform">open_in_new</span>
        <span className="text-[10px] font-black uppercase tracking-widest underline underline-offset-4">{label}</span>
    </div>
)

const EventLog = ({ label, time, type }) => (
    <div className="flex items-start gap-3 py-1">
        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
            type === 'security' ? 'bg-error' :
            type === 'success' ? 'bg-emerald-500' :
            'bg-primary'
        }`}></div>
        <div className="flex-1">
            <p className="text-[11px] font-bold text-on-surface leading-tight">{label}</p>
            <p className="text-[9px] text-on-surface-variant font-medium mt-0.5">{time}</p>
        </div>
    </div>
)

export default AdminDashboard
