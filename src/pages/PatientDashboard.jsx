import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const PatientDashboard = () => {
    const { user } = useAuth()
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/records/')
                setRecords(res.data)
            } catch (err) {
                console.error('Failed to fetch records:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-primary/10"></div>
                <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">Synchronizing Health Vault...</p>
            </div>
        )
    }

    const patientName = user?.first_name || 'Patient'
    const patientID = `HV-${user?.id?.toString().padStart(3, '0')}-${user?.patient_profile?.nin?.slice(-4) || 'X'}`

    return (
        <div className="space-y-8 lg:space-y-12 pb-12">
            {/* ─── WELCOME HEADER ─── */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-full border border-primary/10">Verified Ledger</span>
                        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] px-3 py-1">{patientID}</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-headline font-black text-on-surface tracking-tight leading-none">
                        Welcome back, <span className="text-primary italic">{patientName}</span>
                    </h1>
                </div>
                <div className="flex gap-3">
                    <button className="flex-1 md:flex-initial px-6 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-xl">qr_code_2</span>
                        Digital ID
                    </button>
                    <button className="flex-1 md:flex-initial px-6 py-4 bg-surface-container-high text-on-surface rounded-2xl font-bold text-sm border border-outline-variant/10 hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-xl">ios_share</span>
                        Transfer
                    </button>
                </div>
            </section>

            {/* ─── QUICK STATS BENTO ─── */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard icon="folder_shared" label="Medical Records" value={records.length} color="primary" />
                <StatCard icon="emergency" label="Vitals Status" value="Stable" color="emerald" />
                <StatCard icon="verified" label="Trust Score" value="98%" color="blue" />
                <StatCard icon="history" label="Last Sync" value="2m ago" color="on-surface-variant" />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* ─── HEALTH TIMELINE (LEFT) ─── */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-headline font-black text-on-surface italic uppercase tracking-tighter">Clinical Timeline</h2>
                        <button className="text-primary font-bold text-xs uppercase tracking-widest hover:underline">View All Entries</button>
                    </div>
                    
                    {records.length > 0 ? (
                        <div className="space-y-0 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/20">
                            {records.map((record, idx) => (
                                <TimelineEntry key={record.id} record={record} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-surface-container-low border border-dashed border-outline-variant/30 rounded-3xl p-12 text-center flex flex-col items-center gap-4">
                            <span className="material-symbols-outlined text-5xl text-outline-variant">folder_off</span>
                            <div>
                                <h3 className="text-lg font-bold text-on-surface">No clinical data found</h3>
                                <p className="text-sm text-on-surface-variant max-w-xs mx-auto mt-1">Your encrypted health history will appear here once registered by a clinical node.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── EMERGENCY SNAPSHOT (RIGHT) ─── */}
                <aside className="lg:col-span-4 space-y-8">
                    <div className="p-8 bg-error text-white rounded-[2.5rem] shadow-xl shadow-error/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>emergency</span>
                                <h3 className="font-headline font-black text-2xl tracking-tighter uppercase italic">SOS Snapshot</h3>
                            </div>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between border-b border-white/20 pb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Blood Group</span>
                                    <span className="text-lg font-black">{user?.patient_profile?.blood_group || 'O+'}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/20 pb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Allergies</span>
                                    <span className="text-sm font-bold">Penicillin, Nut Dust</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Conditions</span>
                                    <span className="text-sm font-bold">Asthmatic</span>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-white text-error rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-error-container hover:text-white transition-all active:scale-95">
                                Generate Emergency Token
                            </button>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-subtle space-y-6">
                        <h4 className="font-headline font-black text-on-surface text-xl uppercase tracking-tight">Active Prescriptions</h4>
                        <div className="space-y-4">
                            <PrescriptionItem name="Ventolin Inhaler" dosage="2 puffs every 4hrs" />
                            <PrescriptionItem name="Vitamin C" dosage="1000mg Daily" />
                        </div>
                        <button className="w-full py-4 border-2 border-outline-variant/20 rounded-2xl text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:border-primary/30 transition-all">Refill Request</button>
                    </div>
                </aside>
            </div>
        </div>
    )
}

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-subtle flex flex-col gap-3 group hover:border-primary/20 transition-all">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
            color === 'primary' ? 'bg-primary/5 text-primary' :
            color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
            color === 'blue' ? 'bg-blue-50 text-blue-600' :
            'bg-surface-container text-on-surface-variant'
        }`}>
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">{icon}</span>
        </div>
        <div>
            <p className="text-2xl font-headline font-black text-on-surface leading-none">{value}</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1.5">{label}</p>
        </div>
    </div>
)

const TimelineEntry = ({ record }) => (
    <div className="relative pl-10 pb-8 last:pb-0 group">
        <div className="absolute left-[3px] top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-primary/10 shadow-sm z-10 active:scale-125 transition-transform" />
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-subtle group-hover:border-primary/20 transition-all -translate-y-1 group-hover:-translate-y-2">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                            {new Date(record.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/10">Lab Result</span>
                    </div>
                    <h3 className="text-xl font-headline font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">{record.hospital_name || 'Clinical Facility'}</h3>
                    <p className="text-sm text-on-surface-variant font-medium max-w-md">{record.description || 'Routine diagnostic and clinical observation report.'}</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none p-3 rounded-2xl bg-surface-container-high hover:bg-primary hover:text-white transition-all text-on-surface group/btn">
                        <span className="material-symbols-outlined text-xl">visibility</span>
                    </button>
                    <button className="flex-1 md:flex-none p-3 rounded-2xl bg-surface-container-high hover:bg-primary hover:text-white transition-all text-on-surface">
                        <span className="material-symbols-outlined text-xl">cloud_download</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
)

const PrescriptionItem = ({ name, dosage }) => (
    <div className="flex items-center gap-4 p-4 bg-surface-container rounded-2xl border border-outline-variant/5">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined">pill</span>
        </div>
        <div>
            <p className="text-sm font-bold text-on-surface leading-none">{name}</p>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1">{dosage}</p>
        </div>
        <span className="material-symbols-outlined ml-auto text-outline-variant text-[18px]">chevron_right</span>
    </div>
)

export default PatientDashboard
